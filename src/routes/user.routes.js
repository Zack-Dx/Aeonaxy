import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { upload } from '../middleware/multer.middleware.js';

const router = Router();

router
    .route('/create')
    .post(upload.single('avatar'), UserController().createUser); // Register Route

router.route('/login').post(UserController().loginUser); // Login Route

export default router;
