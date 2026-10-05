// src/middlewares/requireStructurePermission.middleware.ts
// Permite continuar solo si el rol del usuario tiene can_manage_structure = true.
// Se usa en las rutas que crean, editan o desactivan catálogos (marcas, categorías, unidades...).
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

export const requireStructurePermission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const roleId = req.user?.roleId;

    if (!roleId) {
        res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
        return;
    }

    try {
        // Se consulta en la BD (y no en el token) para que un cambio de permisos aplique de inmediato
        const role = await prisma.role.findUnique({
            where: { id: roleId },
            select: { can_manage_structure: true }
        });

        if (!role?.can_manage_structure) {
            res.status(403).json({ error: 'No tienes permisos para modificar la estructura del sistema.' });
            return;
        }

        next();
    } catch (error) {
        next(error);
    }
};
