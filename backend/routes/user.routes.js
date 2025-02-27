import {Router} from 'express'
import * as userController from '../controller/user.controller.js'
import * as authMiddleware from '../middlewares/auth.middleware.js'
import { body } from 'express-validator';

const router = Router();

router.post('/register', 
    body('email').isEmail().withMessage('Email must be Valid'),
    body('password').isLength({min:3}).withMessage('Password must be atleast 3 characters long'),
    userController.createUserController
);

router.post('/login',
    body('email').isEmail().withMessage('Email must be Valid'),
    body('password').isLength({min:3}).withMessage('Password must be atleast 3 characters long'),
    userController.loginController
)

router.get('/profile', authMiddleware.authUser, userController.profileController);

export default router