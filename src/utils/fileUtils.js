import fs from 'node:fs/promises';
import { logger } from '../config/logger.js';

export const removeFileFromLocal = async (localPath) => {
    try {
        await fs.unlink(localPath);
    } catch (error) {
        logger.error(
            error.message || `Failed to unlink file for ${localPath}.`
        );
        throw error;
    }
};
