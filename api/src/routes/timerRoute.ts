import { Router } from 'express';
import * as timerController from '../controllers/timerController'; 

const router = Router();

router.post('/submit-reaction-time', timerController.createATimer);
router.get('/get-reaction-times', timerController.listAllTimes);

export default router;