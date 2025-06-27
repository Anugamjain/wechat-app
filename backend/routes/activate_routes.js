import express from 'express';
import activateController from '../controllers/activate-controller.js';
import authMiddleware from '../middlewares/auth-middlewares.js';
import roomsController from '../controllers/rooms-controller.js';
import userController from '../controllers/user-controller.js';
import upload from '../middlewares/multer.js';

const activateRouter = express.Router();

activateRouter.post('/api/activate', authMiddleware, upload.single("avatar"), activateController.activate);
activateRouter.post('/api/create-room', authMiddleware, roomsController.addRoom);
activateRouter.get('/api/rooms', authMiddleware, roomsController.getRooms);
activateRouter.get('/api/room/:roomId', authMiddleware, roomsController.getRoom);
activateRouter.get('/api/user/:userId', authMiddleware, userController.getUser);
activateRouter.delete('/api/room/:roomId', authMiddleware, roomsController.deleteRoom);

export default activateRouter;