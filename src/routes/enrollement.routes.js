import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { EnrollmentController } from '../controllers/enrollment.controller.js';

const router = Router();

router.route('/').get(authMiddleware, EnrollmentController().enrollments); // Get Enrollment Route

router
    .route('/:courseId')
    .post(authMiddleware, EnrollmentController().enrollUser); //  Create Enrollment Route

export default router;
