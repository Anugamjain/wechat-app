import express from 'express';
import activateController from '../controllers/activate-controller.js';
import authMiddleware from '../middlewares/auth-middlewares.js';
import roomsController from '../controllers/rooms-controller.js';
import userController from '../controllers/user-controller.js';

const activateRouter = express.Router();

activateRouter.post('/api/activate', authMiddleware, activateController.activate);
activateRouter.post('/api/create-room', authMiddleware, roomsController.addRoom);
activateRouter.get('/api/rooms', authMiddleware, roomsController.getRooms);
activateRouter.get('/api/room/:roomId', authMiddleware, roomsController.getRoom);
activateRouter.get('/api/user/:userId', authMiddleware, userController.getUser);

export default activateRouter;