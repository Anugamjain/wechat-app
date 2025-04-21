import otpServices from "../services/otp-services.js";
import hashServices from "../services/hash-services.js";
import userService from "../services/user-service.js";
import tokenService from "../services/token-service.js";
import UserDto from "../dtos/user-dto.js";

class AuthController {
   async sendOTP (req, res) {
      const {phone} = req.body;
      if (!phone) {
         res.status(400).json({message: "phone number is required"});
         return;
      }

      const otp = await otpServices.generateOtp();
      const ttl = 1000 * (5 * 60); // time-to-live = 2 min
      const expires = Date.now() + ttl;
      const data = `${phone}.${otp}.${expires}`;
      const hashedOtp = hashServices.hashData(data);

      // send otp
      try{
         // await otpServices.sendBySms(phone, otp);
         return res.json({
            hash: `${hashedOtp}.${expires}`,
            phone,
            otp
         });
      } catch (err) {
         console.log(err);
         res.status(500).json({message: "SMS sending failed"});
      }
   }

   async verifyOtp(req, res) {
      const {otp, hash, phone} = req.body;
      if (!otp || !hash || !phone) {
         res.status(400).json({
            message: "All fields are required!"
         });
      }

      const [hashedOtp, expires] = hash.split('.');
      if (Date.now() > +expires) {
         res.status(400).json({
            message: "OTP Expired!"
         });
      }

      const data = `${phone}.${otp}.${expires}`;

      if (!otpServices.verifyOtp(hashedOtp, data)) {
         res.status(400).json({message: "Invalid OTP"});
      } 

      let user;

      try{
         user = await userService.findUser({phone});
         if (!user) {
            user = await userService.createUser({phone});
         }
      } catch (err) {
         console.log(err);
         res.status(500).json({message: "DB Error"});
      }
      const {accessToken, refreshToken} = tokenService.generateTokens({_id: user._id, activated: false}); 

      res.cookie('refreshtoken', {
         maxAge: 1000 * 60 * 60 * 24 * 30,
         httponly: true,
      });
      const userdata = new UserDto(user);

      res.json({accessToken, user: userdata});   
   }
}

export default new AuthController();