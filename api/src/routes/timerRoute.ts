import { Router } from 'express';
import * as timerController from '../controllers/timerController'; 
import * as jwtMiddlewares from '../middlewares/jwtMiddlewares';

const router = Router();

router.post('/submit-reaction-time', jwtMiddlewares.verifyToken,  timerController.createATimer);
router.get('/get-reaction-times', jwtMiddlewares.verifyToken, timerController.listAllTimes);

export default router;