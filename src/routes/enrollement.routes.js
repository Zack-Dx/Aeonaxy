import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { EnrollmentController } from '../controllers/enrollment.controller.js';

const router = Router();

router
    .route('/:courseId')
    .post(authMiddleware, EnrollmentController().enrollUser); // Enrollment Route

export default router;
