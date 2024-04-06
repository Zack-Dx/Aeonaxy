import { app } from './app.js';
import { CONFIG } from './config/index.js';
import { logger } from './config/logger.js';
(async () => {
    try {
        app.listen(CONFIG.PORT, () => {
            logger.info(`Server listening on ${CONFIG.PORT}!`);
        });
    } catch (error) {
        logger.error(error.message);
        logger.on('finish', () => {
            process.exit(1);
        });
    }
})();
