import Router from 'express';
import {body} from 'express-validator';
import * as projectController from '../controller/project.controller.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/create',
    authMiddleware.authUser,
    body('name').isString().withMessage('Project name is required'),
    projectController.createProject
)

export default router;