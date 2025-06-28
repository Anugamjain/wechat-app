import crypto from 'crypto';
import twilio from 'twilio';
import dotenv from 'dotenv';
import hashServices from './hash-services.js';
import nodemailer from 'nodemailer';
dotenv.config();

const smsSID = process.env.SMS_SID;
const smsAuthToken = process.env.SMS_AUTH_TOKEN;
const client = twilio(smsSID, smsAuthToken);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

class OtpService {
   async generateOtp() {
      const otp = crypto.randomInt(1000, 9999);
      return otp;
   }

   async sendBySms(phone, otp) {
      try {
        const message = await client.messages.create({
          from: process.env.SMS_FROM_NUMBER,
          to: phone,
          body: `Your coder house otp is ${otp}`,
        });
        console.log('SMS sent successfully:', message.sid);
      } catch (err) {
        console.error('Error sending SMS:', err.message);
        throw err;
      }
   }

   async sendByEmail(email, otp) {
      const mailOptions = {
         from: process.env.AUTH_EMAIL,
         to: email,
         subject: "Verify Your Email for WeChat",
         html: `<p>Your WeChat OTP is <strong>${otp}</strong>. <br/> This code expires in 5 minutes</p>`,
      };
      await transporter.sendMail(mailOptions);
   }

   verifyOtp(hashedOtp, data) {
      const hash = hashServices.hashData(data);
      return hashedOtp === hash;
   }
}

export default new OtpService();