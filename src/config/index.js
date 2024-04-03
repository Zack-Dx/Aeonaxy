import { config } from 'dotenv'
config()

const {
    PORT,
    DATABASE_URL,
    CLOUDINARY_API_SECRET,
    CLOUDINARY_API_KEY,
    CLOUDINARY_CLOUD_NAME,
} = process.env

export const CONFIG = {
    PORT,
    DATABASE_URL,
    CLOUDINARY_API_SECRET,
    CLOUDINARY_API_KEY,
    CLOUDINARY_CLOUD_NAME,
}
