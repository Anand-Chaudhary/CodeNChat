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

router.get('/all', authMiddleware.authUser, projectController.getAllProjects);

router.put('/add-user', 
    authMiddleware.authUser, 
    body('projectId').isString().withMessage('Project ID is required and must be a string'),
    body('users').isArray({ min: 1 }).withMessage('Users must be an array of strings').custom((users) => {
        return users.every(user => typeof user === 'string');
    }).withMessage('Each user must be a string'),
    projectController.addUserToProject
);

export default router;