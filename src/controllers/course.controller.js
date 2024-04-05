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
        update: asyncHandler(async (req, res) => {
            const { id } = req.params;

            const { name, category, level, description } = req.body;

            if (!name && !category && !level && !description) {
                throw new ApiError(
                    400,
                    'At least one field is required for update.'
                );
            }

            // Checking if course exists
            const existingCourse = await prisma.course.findUnique({
                where: {
                    id,
                },
            });

            if (!existingCourse) {
                throw new ApiError(404, 'Course not found.');
            }

            // Constrcuting Update Object
            const updateFields = {};

            if (name) {
                updateFields.name = name;
            }
            if (category) {
                updateFields.category = category;
            }
            if (level) {
                updateFields.level = level;
            }
            if (description) {
                updateFields.description = description;
            }

            // Update the course
            const updatedCourse = await prisma.course.update({
                where: { id },
                data: updateFields,
            });

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        updatedCourse,
                        'Course updated successfully.'
                    )
                );
        }),
        delete: asyncHandler(async (req, res) => {
            const { id } = req.params;

            // Checking if course exists or not
            const existingCourse = await prisma.course.findUnique({
                where: {
                    id,
                },
            });

            if (!existingCourse) {
                throw new ApiError(404, 'Course not found.');
            }

            // Deleting the course
            const deleteCourse = await prisma.course.delete({
                where: {
                    id,
                },
            });

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        deleteCourse,
                        'Course deleted successfully.'
                    )
                );
        }),
    };
}
