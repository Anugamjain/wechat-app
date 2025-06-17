import otpServices from "../services/otp-services.js";
import hashServices from "../services/hash-services.js";
import userService from "../services/user-service.js";
import tokenService from "../services/token-service.js";
import UserDto from "../dtos/user-dto.js";

class AuthController {
  async sendOTP(req, res) {
    const { phone } = req.body;
    if (!phone) {
      res.status(400).json({ message: "phone number is required" });
      return;
    }

    const otp = await otpServices.generateOtp();
    const ttl = 1000 * (5 * 60); // time-to-live = 5 min
    const expires = Date.now() + ttl;
    const data = `${phone}.${otp}.${expires}`;
    const hashedOtp = hashServices.hashData(data);

    try {
      // await otpServices.sendBySms(phone, otp);
      return res.json({
        hash: `${hashedOtp}.${expires}`,
        phone,
        otp,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "SMS sending failed" });
    }
  }

  async verifyOtp(req, res) {
    const { otp, hash, phone } = req.body;
    if (!otp || !hash || !phone) {
      res.status(400).json({
        message: "All fields are required!",
      });
    }

    const [hashedOtp, expires] = hash.split(".");
    if (Date.now() > +expires) {
      res.status(400).json({
        message: "OTP Expired!",
      });
    }

    const data = `${phone}.${otp}.${expires}`;

    if (!otpServices.verifyOtp(hashedOtp, data)) {
      res.status(400).json({ message: "Invalid OTP" });
    }

    let user;

    try {
      user = await userService.findUser({ phone });
      if (!user) {
        user = await userService.createUser({ phone });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "DB Error" });
    }
    const { accessToken, refreshToken } = tokenService.generateTokens({
      _id: user._id,
      activated: false,
    });

    await tokenService.storeRefreshToken(refreshToken, user._id);

    res.cookie("refreshtoken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      httponly: true,
    });

    res.cookie("accesstoken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httponly: true,
      //   secure: false, // ← required in HTTPS
      //   sameSite: "none", // ← allow cross-origin
    });

    const userdata = new UserDto(user);

    res.json({ auth: true, user: userdata });
  }

  async refresh(req, res) {
    // get refresh token from cookie
    const { refreshtoken: refreshTokenFromCookie } = req.cookies;

    // check if the token is verified
    let userData;
    try {
      userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);
      // returns {_id, activated}
    } catch (err) {
      return res.status(401).json({ message: "Invalid Token from cookie" });
    }

    // check if token is in db
    try {
      const token = await tokenService.findRefreshToken(
        userData._id,
        refreshTokenFromCookie
      );
      if (!token) {
        return res.status(401).json({ message: "Invalid Token" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Error 1" });
    }

    // check if valid user
    const user = await userService.findUser({ _id: userData._id });
    if (!user) {
      return res.status(404).json({ message: "No user" });
    }

    // generate new token and put it in db
    const { refreshToken, accessToken } = tokenService.generateTokens({
      _id: userData._id,
    });

    // update refresh token
    try {
      await tokenService.updateRefreshToken(userData._id, refreshToken);
    } catch (err) {
      return res.status(500).json({ message: "Internal Error" });
    }

    res.cookie("refreshtoken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      httponly: true,
    });

    res.cookie("accesstoken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httponly: true,
    });

    const userDto = new UserDto(user);

    res.json({ auth: true, user: userDto });
  }

  async logoutUser(req, res) {
    try {
      // Delete refresh token from DB
      const { refreshtoken } = req.cookies;
      await tokenService.removeToken(refreshtoken);

      // Clear cookies
      res.clearCookie("refreshtoken", {
        httpOnly: true,
        sameSite: "strict",
        // secure: process.env.NODE_ENV === 'production', // only in production
      });

      res.clearCookie("accesstoken", {
        httpOnly: true,
        sameSite: "strict",
        // secure: process.env.NODE_ENV === 'production',
      });

      // Send response
      res.json({ user: null, auth: false });
    } catch (err) {
      console.error("Logout Error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new AuthController();
