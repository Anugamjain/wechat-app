import express from 'express';
import authController from '../controllers/auth-controller.js';
import authMiddleWare from '../middlewares/auth-middlewares.js';

const authRouter = express.Router();

authRouter.post('/api/send-otp', authController.sendOTP);
authRouter.post('/api/verify-otp', authController.verifyOtp);
authRouter.get('/api/refresh', authController.refresh);
authRouter.post('/api/logout', authMiddleWare, authController.logoutUser);

authRouter.get('/', (req, res) => {
   res.send("Hello from express js");
});


export default authRouter;