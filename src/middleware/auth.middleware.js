import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { CONFIG } from '../config/index.js';
import { prisma } from '../../client/prismaClient.js';

export const authMiddleware = asyncHandler(async (req, _, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new ApiError(401, 'Unauthorized request.');
        }

        const decodedToken = jwt.verify(token, CONFIG.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decodedToken.sub },
            select: {
                id: true,
                email: true,
                name: true,
                profilePicture: true,
                role: true,
            },
        });

        if (!user) {
            throw new ApiError(404, 'User not found.');
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || 'Invalid access token');
    }
});

export const adminAuthMiddleware = asyncHandler((req, res, next) => {
    if (req.user.role === 'admin') {
        next();
        return;
    }
    throw new ApiError(401, 'Unauthorized request.');
});
