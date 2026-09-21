// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const [scheme, token] = req.headers.authorization?.split(' ') ?? [];

    if (scheme !== 'Bearer' || !token) {
        res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
        return;
    }

    try {
        req.user = verifyAccessToken(token);
        next();
    } catch {
        res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};