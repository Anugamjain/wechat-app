import express from 'express';
import authController from '../controllers/auth-controller.js';

const authRouter = express.Router();

authRouter.post('/api/send-otp', authController.sendOTP);
authRouter.post('/api/verify-otp', authController.verifyOtp);

export default authRouter;