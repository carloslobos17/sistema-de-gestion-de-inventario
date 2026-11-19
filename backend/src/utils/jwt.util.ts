// src/utils/jwt.util.ts
// Firma y verifica el access token (JWT de vida corta). El refresh token ya no es JWT: ver auth/refresh-token.util.ts
import jwt, { type SignOptions } from 'jsonwebtoken';
import type { JwtPayload } from '../modules/auth/auth.types';

const DEFAULT_ACCESS_EXPIRES_IN = '15m';

// Se leen al usarse (no al importar) para no depender del orden en que se carga el .env
function getAccessSecret(): string {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) throw new Error('Falta JWT_ACCESS_SECRET en el .env');
    return secret;
}

function getAccessExpiresIn(): SignOptions['expiresIn'] {
    return (process.env.JWT_ACCESS_EXPIRES_IN ?? DEFAULT_ACCESS_EXPIRES_IN) as SignOptions['expiresIn'];
}

export function generateAccessToken(payload: JwtPayload): string {
    return jwt.sign({ userId: payload.userId, roleId: payload.roleId }, getAccessSecret(), {
        expiresIn: getAccessExpiresIn(),
    });
}

// Lanza error si el token es falso o venció (el middleware responde 401)
export function verifyAccessToken(token: string): JwtPayload {
    const decoded = jwt.verify(token, getAccessSecret()) as JwtPayload;
    return { userId: decoded.userId, roleId: decoded.roleId };
}
