import { Router } from 'express';
import * as aiController from '../controller/ai.controller.js';

const router = Router();

router.get('/get-response', aiController.getResult);

export default router;