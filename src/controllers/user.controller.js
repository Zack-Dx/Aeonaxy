import { DEFAULT_AVATAR_URL } from '../constants/index.js';
import jwt from 'jsonwebtoken';
import { prisma } from '../../client/prismaClient.js';
import { v2 as cloudinary } from 'cloudinary';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { comparePassword, hashPassword } from '../utils/bcryptUtils.js';
import { removeFileFromLocal } from '../utils/fileUtils.js';
import { checkPasswordStrength } from '../utils/helpers.js';
import {
    generateAccessToken,
    generateResetPassToken,
} from '../utils/jwtUtils.js';
import { CONFIG } from '../config/index.js';
import { sendResetPasswordEmail } from '../utils/mailerUtils.js';

export function UserController() {
    return {
        create: asyncHandler(async (req, res) => {
            const { email, name, password } = req.body;
            const file = req.file;

            // Validation
            if (!email || !password || !name) {
                throw new ApiError(400, 'All fields are required.');
            }

            // Password Strength Check
            const passwordStrengthError = checkPasswordStrength(password);

            if (passwordStrengthError) {
                throw new ApiError(400, passwordStrengthError);
            }

            // Existing User Check in the Database
            const existingUser = await prisma.user.findUnique({
                where: {
                    email,
                },
            });

            if (existingUser) {
                throw new ApiError(
                    409,
                    'User with such credentials already exists!'
                );
            }

            // Avatar URL Creation
            let avatarUrl = '';

            if (file) {
                const { secure_url } = await cloudinary.uploader.upload(
                    file.path
                );
                avatarUrl = secure_url;
                await removeFileFromLocal(file.path);
            } else {
                avatarUrl = DEFAULT_AVATAR_URL;
            }

            // Hashing The Password
            const hashedPassword = await hashPassword(password);

            const registeredUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    profilePicture: avatarUrl,
                    role: CONFIG.DEFAULT_USER_ROLE,
                },
            });

            return res
                .status(201)
                .json(
                    new ApiResponse(
                        201,
                        registeredUser,
                        'User created successfully.'
                    )
                );
        }),
        login: asyncHandler(async (req, res) => {
            const { email, password } = req.body;

            // Input  Validation
            if (!email || !password) {
                throw new ApiError(400, 'All fields are required.');
            }

            // Existing User Check in the Database
            const existingUser = await prisma.user.findUnique({
                where: {
                    email,
                },
            });

            if (!existingUser) {
                throw new ApiError(404, 'User not found.');
            }

            // Password Validation
            const passMatch = await comparePassword(
                password,
                existingUser.password
            );

            if (!passMatch) {
                throw new ApiError(401, 'Invalid credentials.');
            }

            // Generating Access Token
            const payload = {
                sub: existingUser.id,
                name: existingUser.name,
            };

            const accessToken = generateAccessToken(payload);
            const response = { token: accessToken };
            return res
                .status(200)
                .json(
                    new ApiResponse(200, response, 'Logged in successfully.')
                );
        }),
        profile: asyncHandler(async (req, res) => {
            const user = await prisma.user.findUnique({
                where: { id: req.user.id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    profilePicture: true,
                },
            });

            return res
                .status(200)
                .json(
                    new ApiResponse(200, user, 'Profile fetched successfully.')
                );
        }),
        update: asyncHandler(async (req, res) => {
            const { id, profilePicture } = req.user;
            const { name } = req.body;
            const file = req.file;

            // Validation
            if (!name && !file) {
                throw new ApiError(
                    400,
                    'At least one field is required for update.'
                );
            }

            // New Fields
            let newAvatarUrl = '';
            let newName = '';

            // Updating Fields
            if (name) {
                newName = name;
            }

            if (file) {
                if (profilePicture.startsWith(CONFIG.IMAGE_HOST)) {
                    const public_id = profilePicture
                        .split('/')
                        .at(-1)
                        .split('.')[0];
                    await cloudinary.uploader.destroy(public_id);
                }

                const { secure_url } = await cloudinary.uploader.upload(
                    file.path
                );
                await removeFileFromLocal(file.path);
                newAvatarUrl = secure_url;
            }

            const updatedData = {};

            if (newName) {
                updatedData.name = newName;
            }

            if (newAvatarUrl) {
                updatedData.profilePicture = newAvatarUrl;
            }

            const updatedUser = await prisma.user.update({
                where: {
                    id,
                },
                data: { ...updatedData },
            });

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        updatedUser,
                        'Profile updated successfully.'
                    )
                );
        }),
        delete: asyncHandler(async (req, res) => {
            const { id, profilePicture } = req.user;

            // Removing the assets from cloudinary
            if (profilePicture.startsWith(CONFIG.IMAGE_HOST)) {
                const public_id = profilePicture
                    .split('/')
                    .at(-1)
                    .split('.')[0];
                await cloudinary.uploader.destroy(public_id);
            }

            // Deleting the user
            const deletedUser = await prisma.user.delete({
                where: { id },
            });

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        deletedUser,
                        'User deleted successfully.'
                    )
                );
        }),
        forgotPassword: asyncHandler(async (req, res) => {
            const { email } = req.params;

            // Existing User Check
            const existingUser = await prisma.user.findUnique({
                where: {
                    email,
                },
            });

            if (!existingUser) {
                throw new ApiError(404, 'User not found.');
            }

            // Generate Reset Pass Token
            const resetPasswordToken = generateResetPassToken({
                sub: existingUser.id,
            });

            await prisma.user.update({
                where: {
                    email,
                },
                data: {
                    resetPasswordToken,
                },
            });

            // Sending the email
            sendResetPasswordEmail(existingUser, resetPasswordToken);

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        null,
                        'Password reset link sent successfully, please check your email.'
                    )
                );
        }),
        resetPassword: asyncHandler(async (req, res) => {
            const { user_id, reset_token } = req.params;
            const { newPassword } = req.body;

            // Validation
            if (!newPassword) {
                throw new ApiError(400, 'New Password is required.');
            }

            // Password Strength Check
            const passwordStrengthError = checkPasswordStrength(newPassword);

            if (passwordStrengthError) {
                throw new ApiError(400, passwordStrengthError);
            }

            // Existing User Check
            const existingUser = await prisma.user.findUnique({
                where: {
                    id: user_id,
                },
            });

            if (!existingUser) {
                throw new ApiError(404, 'User not found.');
            }

            // Matching the tokens
            if (existingUser.resetPasswordToken !== reset_token) {
                throw new ApiError(401, 'Invalid Token.');
            }

            // Hashing & Saving the password
            const hashedPassword = await hashPassword(newPassword);
            await prisma.user.update({
                where: {
                    id: user_id,
                },
                data: {
                    password: hashedPassword,
                    resetPasswordToken: '',
                },
            });

            return res
                .status(200)
                .json(
                    new ApiResponse(200, null, 'Password updated successfully.')
                );
        }),
    };
}
