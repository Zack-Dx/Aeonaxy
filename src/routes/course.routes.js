import { Router } from 'express';
import { CourseController } from '../controllers/course.controller.js';
import {
    adminAuthMiddleware,
    authMiddleware,
} from '../middleware/auth.middleware.js';

const router = Router();

router
    .route('/')
    .get(CourseController().courses)
    .post(authMiddleware, adminAuthMiddleware, CourseController().create); // Fetch & Create Course Routes

router
    .route('/delete/:id')
    .delete(authMiddleware, adminAuthMiddleware, CourseController().delete); // Delete Course Route

export default router;
