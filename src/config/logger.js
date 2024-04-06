import winston from 'winston';
import { CONFIG } from '../config/index.js';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: './logs/error.log',
            level: 'error',
        }),
        new winston.transports.File({ filename: './logs/combined.log' }),
    ],
});

if (CONFIG.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}

export { logger };
