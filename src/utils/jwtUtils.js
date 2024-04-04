import jwt from 'jsonwebtoken';

import { CONFIG } from '../config/index.js';

export function generateAccessToken(payload) {
    const token = jwt.sign(payload, CONFIG.JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '1d',
        issuer: 'backend-service',
    });
    return token;
}
