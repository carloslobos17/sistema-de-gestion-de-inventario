// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    // 1. Obtener el header de autorización
    const authHeader = req.headers['authorization'];

    // 2. Extraer el token
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // 401 Unauthorized
        res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
        return;
    }

    try {
        // 3. Verificar si el token es válido y no ha expirado
        const decoded = verifyAccessToken(token);

        // 4. Guardar los datos del usuario en la petición
        req.user = decoded;

        // 5. Dejarlo pasar a la ruta solicitada
        next();
    } catch (error) {
        // 403 Forbidden: Traes una llave, pero es falsa o ya caducó
        res.status(403).json({ error: 'Token inválido o expirado.' });
        return;
    }
};