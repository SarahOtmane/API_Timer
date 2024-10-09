import { Router } from 'express';
import * as userController from '../controllers/userController';
import * as jwtMiddlewares from '../middlewares/jwtMiddlewares'; 

const router = Router();

router.post('/register', userController.registerAUser);
router.post('/login', userController.loginUser);

// ROUTES ADMIN
router.get('/admin/users', jwtMiddlewares.verifyTokenAdmin, userController.getAllUser);
router.get('/admin/user/:id', jwtMiddlewares.verifyTokenAdmin, userController.getUserById);
router.delete('/admin/user/:id', jwtMiddlewares.verifyTokenAdmin, userController.deleteAUser);

export default router;
