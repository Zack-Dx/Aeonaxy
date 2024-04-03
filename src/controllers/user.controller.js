import { DEFAULT_AVATAR_URL } from '../constants/index.js'
import { prisma } from '../../client/prismaClient.js'
import { v2 as cloudinary } from 'cloudinary'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { hashPassword } from '../utils/bcryptUtils.js'
import { removeFileFromLocal } from '../utils/fileUtils.js'

export function UserController() {
    return {
        createUser: asyncHandler(async (req, res) => {
            const { email, name, password } = req.body
            const file = req.file

            // Validation
            if (!email || !password || !name) {
                throw new ApiError(400, 'All fields are required.')
            }

            // Existing User Check in the Database
            const existingUser = await prisma.user.findUnique({
                where: {
                    email,
                },
            })

            if (existingUser) {
                throw new ApiError(
                    409,
                    'User with such credentials already exists!'
                )
            }

            // Avatar URL Creation
            let avatarUrl = ''

            if (file) {
                const { secure_url } = await cloudinary.uploader.upload(
                    file.path
                )
                avatarUrl = secure_url
                await removeFileFromLocal(file.path)
            } else {
                avatarUrl = DEFAULT_AVATAR_URL
            }

            // Hashing The Password
            const hashedPassword = await hashPassword(password)

            const registeredUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    profilePicture: avatarUrl,
                },
            })

            return res
                .status(201)
                .json(
                    new ApiResponse(
                        201,
                        registeredUser,
                        'User created successfully.'
                    )
                )
        }),
    }
}
