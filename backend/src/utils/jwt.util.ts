// src/utils/jwt.util.ts
import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtPayload } from '../modules/auth/auth.types';

export const generateTokens = (payload: JwtPayload) => {
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!accessSecret || !refreshSecret) {
        throw new Error('FATAL ERROR: Las variables de entorno para JWT no están definidas.');
    }

    const accessOptions: SignOptions = {
        expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as SignOptions['expiresIn']
    };

    const refreshOptions: SignOptions = {
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '30m') as SignOptions['expiresIn']
    };

    const accessToken = jwt.sign(payload, accessSecret, accessOptions);
    const refreshToken = jwt.sign(payload, refreshSecret, refreshOptions);


    const { exp } = jwt.decode(refreshToken) as { exp: number };
    const refreshExpiresAt = new Date(exp * 1000);

    return { accessToken, refreshToken, refreshExpiresAt };
};

export const verifyAccessToken = (token: string): JwtPayload => {
    const accessSecret = process.env.JWT_ACCESS_SECRET;

    if (!accessSecret) {
        throw new Error('FATAL ERROR: JWT_ACCESS_SECRET no está definido.');
    }

    return jwt.verify(token, accessSecret) as JwtPayload;
};