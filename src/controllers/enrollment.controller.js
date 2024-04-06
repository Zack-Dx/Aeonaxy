import { prisma } from '../../client/prismaClient.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendEnrollmentSuccessMail } from '../utils/mailerUtils.js';

export function EnrollmentController() {
    return {
        enrollUser: asyncHandler(async (req, res) => {
            const { courseId } = req.params;
            const { id: userId } = req.user;

            // Checking if the course exists
            const existingCourse = await prisma.course.findUnique({
                where: {
                    id: courseId,
                },
            });

            if (!existingCourse) {
                throw new ApiError(404, 'Course not found.');
            }

            // Checking if the user is already enrolled
            const existingEnrollment = await prisma.enrollment.findFirst({
                where: {
                    userId,
                    courseId,
                },
            });

            if (existingEnrollment) {
                throw new ApiError(
                    400,
                    'User is already enrolled in this course.'
                );
            }

            // Enrolling the user
            const enrollment = await prisma.enrollment.create({
                data: {
                    userId,
                    courseId,
                },
            });

            // Sending mail on successful enrollment
            sendEnrollmentSuccessMail(req.user, existingCourse.name);

            return res
                .status(201)
                .json(
                    new ApiResponse(
                        201,
                        enrollment,
                        `User enrolled in ${existingCourse.name} successfully.`
                    )
                );
        }),
    };
}
