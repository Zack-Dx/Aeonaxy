import express from 'express';
import userRouter from './routes/user.routes.js';
import courseRouter from './routes/course.routes.js';
import enrollmentRouter from './routes/enrollement.routes.js';
import cloudinary from 'cloudinary';
import { CONFIG } from './config/index.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

// Middlewares
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));

cloudinary.config({
    cloud_name: CONFIG.CLOUDINARY_CLOUD_NAME,
    api_key: CONFIG.CLOUDINARY_API_KEY,
    api_secret: CONFIG.CLOUDINARY_API_SECRET,
});

// Routes
app.use('/api/user', userRouter);
app.use('/api/course', courseRouter);
app.use('/api/user/enroll', enrollmentRouter);

// Global Error Handler
app.use(errorHandler);

export { app };
