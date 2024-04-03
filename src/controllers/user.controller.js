import { prisma } from '../../client/prismaClient.js'
import { removeFileFromLocal } from '../utils/fileUtils.js'
import { hashPassword } from '../utils/bcryptUtils.js'
import { v2 as cloudinary } from 'cloudinary'

export function UserController() {
    return {
        createUser: async (req, res) => {
            const { email, name, password } = req.body
            const file = req.file

            try {
                // Validation
                if (!email || !password || !name) {
                    if (file) await removeFileFromLocal(file.path)
                    return res
                        .status(400)
                        .json({ message: 'All fields are required.' })
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
                    avatarUrl =
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg7ZUTTrOPQXUnTxj0jx0fuPgQNEo6wB_BwdDjbefB39GTHKveVvWCY2vcZ-TZHMznSZ4&usqp=CAU'
                }

                // Existing User Check in the Database
                const existingUser = await prisma.user.findUnique({
                    where: {
                        email,
                    },
                })

                if (existingUser) {
                    if (file) await removeFileFromLocal(file.path)
                    return res.status(400).json({
                        success: false,
                        data: null,
                        message: 'User with such credentials already exists!',
                    })
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

                return res.status(201).json({
                    success: true,
                    data: registeredUser,
                    message: 'User created successfully!',
                })
            } catch (error) {
                console.log(error)
                if (file) await removeFileFromLocal(file.path)
                return res.status(500).json({
                    success: false,
                    data: null,
                    message: 'Internal Server Error!',
                })
            }
        },
    }
}
