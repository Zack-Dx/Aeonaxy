import bcrypt from 'bcrypt';
import { logger } from '../config/logger.js';

export const hashPassword = async (password) => {
    const saltRounds = 10;
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        logger.error(error.message || 'Failed to hash password.');
        throw error;
    }
};

export const comparePassword = async (inputPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(inputPassword, hashedPassword);
    } catch (error) {
        logger.error(error.message || 'Failed to compare password.');
        throw error;
    }
};
