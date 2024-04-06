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
        enrollments: asyncHandler(async (req, res) => {
            const { id } = req.user;

            // Querying Enrollments
            const user = await prisma.user.findUnique({
                where: { id },
                include: {
                    enrollments: {
                        include: {
                            course: true,
                        },
                    },
                },
            });

            // No enrollments response
            if (user.enrollments.length === 0) {
                return res
                    .status(200)
                    .json(
                        new ApiResponse(
                            200,
                            [],
                            'User is not enrolled in any course.'
                        )
                    );
            }

            // Structuring Response
            const enrolledCourses = user.enrollments.map(
                (enrollment) => enrollment.course
            );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        count: enrolledCourses.length,
                        enrolledCourses,
                    },
                    'Enrollments fetched successfully.'
                )
            );
        }),
    };
}
