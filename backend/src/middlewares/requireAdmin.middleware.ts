import { Request, Response, NextFunction } from 'express';

const ROL_ADMINISTRADOR_ID = 1;

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (req.user?.rolId !== ROL_ADMINISTRADOR_ID) {
        res.status(403).json({ error: 'No tienes permisos para realizar esta acción.' });
        return;
    }
    next();
};