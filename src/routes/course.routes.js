import { Router } from 'express';
import { CourseController } from '../controllers/course.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.route('/').get(CourseController().courses); // Fetch Courses Route (Paginated)
router.route('/create').post(authMiddleware, CourseController().create); // Create Course Route

export default router;
