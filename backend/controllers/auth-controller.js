import otpServices from "../services/otp-services.js";
import hashServices from "../services/hash-services.js";
import userService from "../services/user-service.js";
import tokenService from "../services/token-service.js";
import UserDto from "../dtos/user-dto.js";

class AuthController {
  async sendOTP(req, res) {
    const { reqType, phone, email } = req.body;
    if (reqType == 'phone' && !phone) {
      return res.status(400).json({ message: "phone number is required" });
    }
    if (reqType == 'email' && !email) {
      return res.status(400).json({ message: "email is required" });
    }
    if (reqType !== 'phone' && reqType !== 'email') {
      return res.status(400).json({ message: "Invalid request type" });
    }
    if (reqType === 'phone') {
      const phoneRegex = /^\+[1-9]\d{9,14}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: "Invalid phone number" });
      }
    } else if (reqType === 'email') {
      const emailRegex = /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:(?:\\[\x00-\x7F])|[^\\"])*")@(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|(?:\[(?:[0-9]{1,3}\.){3}[0-9]{1,3}\]))$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email address" });
      }
    }

    const otp = await otpServices.generateOtp();
    const ttl = 1000 * (5 * 60); // time-to-live = 5 min
    const expires = Date.now() + ttl;
    const data = `${reqType === 'phone' ? phone : email}.${otp}.${expires}`;
    const hashedOtp = hashServices.hashData(data);

    try {
      if (reqType === 'phone') {
        // await otpServices.sendBySms(phone, otp);
      } else if (reqType === 'email') {
        await otpServices.sendByEmail(email, otp);
      }

      // Store the OTP hash and expiration in the database or cache
      // This is a placeholder; implement your storage logic here
      // await otpServices.storeOtp({ phone, email, hashedOtp, expires });
      return res.json({
        message: "OTP sent successfully",
        hash: `${hashedOtp}.${expires}`,
        contact: reqType === 'phone' ? phone : email,
        otp: reqType === 'phone' ? otp : null,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "OTP sending failed"});
    }
  }

  async verifyOtp(req, res) {
    const { otp, hash, contact, type } = req.body;
    if (!otp || !hash || !contact || !type) {
      return res.status(400).json({
        message: "All fields are required!",
      });
    }

    const [hashedOtp, expires] = hash.split(".");
    if (Date.now() > +expires) {
      return res.status(400).json({
        message: "OTP Expired!",
      });
    }

    const data = `${contact}.${otp}.${expires}`;

    if (!otpServices.verifyOtp(hashedOtp, data)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    
    let user;
    const queryField = type === 'email' ? { email: contact } : { phone: contact };
    try {
      user = await userService.findUser({ ...queryField });
      if (!user) {
        user = await userService.createUser({ ...queryField });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "DB Error" });
    }
    const { accessToken, refreshToken } = tokenService.generateTokens({
      _id: user._id,
      activated: false,
    });

    await tokenService.storeRefreshToken(refreshToken, user._id);

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      secure: isProduction, // false on local, true on prod
      sameSite: isProduction ? "None" : "Lax", // Lax works locally
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      secure: isProduction, // false on local, true on prod
      sameSite: isProduction ? "None" : "Lax", // Lax works locally
    });

    const userdata = new UserDto(user);

    res.json({ auth: true, user: userdata });
  }

  async refresh(req, res) {
    // get refresh token from cookie
    const { refreshToken: refreshTokenFromCookie } = req.cookies;

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

    
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      secure: isProduction, // false on local, true on prod
      sameSite: isProduction ? "None" : "Lax", // Lax works locally
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      secure: isProduction, // false on local, true on prod
      sameSite: isProduction ? "None" : "Lax", // Lax works locally
    });

    const userDto = new UserDto(user);

    res.json({ auth: true, user: userDto });
  }

  async logoutUser(req, res) {
    try {
      // Delete refresh token from DB
      const { refreshToken } = req.cookies;
      await tokenService.removeToken(refreshToken);

      const isProduction = process.env.NODE_ENV === "production";

      // Clear cookies
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProduction, // false on local, true on prod
        sameSite: isProduction ? "None" : "Lax", // Lax works locally
      });

      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: isProduction, // false on local, true on prod
        sameSite: isProduction ? "None" : "Lax", // Lax works locally
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
