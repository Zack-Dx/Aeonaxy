import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { upload } from '../middleware/multer.middleware.js';

const router = Router();

router
    .route('/create')
    .post(upload.single('avatar'), UserController().createUser);

export default router;
