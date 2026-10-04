import { Request, Response, NextFunction } from 'express';

const ADMIN_ROLE_ID = 1;

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (req.user?.roleId !== ADMIN_ROLE_ID) {
        res.status(403).json({ error: 'No tienes permisos para realizar esta acción.' });
        return;
    }
    next();
};