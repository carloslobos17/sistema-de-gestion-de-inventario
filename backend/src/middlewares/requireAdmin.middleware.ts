// src/middlewares/requireAdmin.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ROLE_IDS } from '../constants/roles';

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (req.user?.roleId !== ROLE_IDS.ADMIN) {
        res.status(403).json({ error: 'No tienes permisos para realizar esta acción.' });
        return;
    }
    next();
};
