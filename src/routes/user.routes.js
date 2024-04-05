import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { UserController } from '../controllers/user.controller.js';
import { upload } from '../middleware/multer.middleware.js';

const router = Router();

router.route('/create').post(upload.single('avatar'), UserController().create); // Register Route

router.route('/login').post(UserController().login); // Login Route

router
    .route('/profile')
    .get(authMiddleware, UserController().profile)
    .patch(authMiddleware, upload.single('avatar'), UserController().update)
    .delete(authMiddleware, UserController().delete); // Profile Route (GET, UPDATE, DELETE)

router.route('/forgot-pass/:email').post(UserController().forgotPassword); // Forgot Password Route

router
    .route('/reset-pass/:user_id/:reset_token')
    .post(UserController().resetPassword); // Reset Password Route

export default router;
