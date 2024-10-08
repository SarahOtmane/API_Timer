import { Router } from 'express';
import * as userController from '../controllers/userController'; 

const router = Router();

router.post('/register', userController.registerAUser);
router.post('/login', userController.loginUser);

export default router;
