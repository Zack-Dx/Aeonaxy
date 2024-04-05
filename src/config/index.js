import { config } from 'dotenv';
config();

const {
    NODE_ENV,
    PORT,
    DATABASE_URL,
    CLOUDINARY_API_SECRET,
    CLOUDINARY_API_KEY,
    CLOUDINARY_CLOUD_NAME,
    JWT_SECRET,
    RESET_PASS_SECRET,
    IMAGE_HOST,
    DEFAULT_USER_ROLE,
    MAILER_API_KEY,
} = process.env;

export const CONFIG = {
    NODE_ENV,
    PORT,
    DATABASE_URL,
    CLOUDINARY_API_SECRET,
    CLOUDINARY_API_KEY,
    CLOUDINARY_CLOUD_NAME,
    JWT_SECRET,
    RESET_PASS_SECRET,
    IMAGE_HOST,
    DEFAULT_USER_ROLE,
    MAILER_API_KEY,
};
