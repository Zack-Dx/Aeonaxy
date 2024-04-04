import { prisma } from '../../client/prismaClient.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export function CourseController() {
    return {
        create: asyncHandler(async (req, res) => {
            const { name, category, level, description } = req.body;

            // Validation
            if (!name || !category || !level || !description) {
                throw new ApiError(400, 'All fields are required.');
            }

            // Creating a new course
            const course = await prisma.course.create({
                data: {
                    name,
                    category,
                    level,
                    description,
                },
            });

            return res
                .status(201)
                .json(
                    new ApiResponse(201, course, 'Course Created Successfully.')
                );
        }),
        courses: asyncHandler(async (req, res) => {
            let { page = 1, limit = 10 } = req.query;
            page = parseInt(page);
            limit = parseInt(limit);

            // Checking if page or limit is not a number, setting default values
            if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
                page = 1;
                limit = 10;
            }

            const offset = (page - 1) * limit;

            const courses = await prisma.course.findMany({
                skip: offset,
                take: limit,
            });

            if (courses.length === 0) {
                throw new ApiError(404, 'No courses found.');
            }

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        courses,
                        'Courses retrieved successfully.'
                    )
                );
        }),
    };
}
