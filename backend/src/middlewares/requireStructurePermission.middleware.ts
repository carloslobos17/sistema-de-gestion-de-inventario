// src/middlewares/requireStructurePermission.middleware.ts
// Permite continuar solo si el rol del usuario tiene can_manage_structure = true.
//   - requireStructurePermission: siempre lo exige (crear/editar/desactivar catálogos).
//   - requireStructurePermissionWhen: lo exige SOLO si la petición toca algo sensible
//     (ej. un vendedor puede editar un cliente, pero no su límite de crédito).
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { prisma } from '../config/db';

const DEFAULT_FORBIDDEN_MESSAGE = 'No tienes permisos para modificar la estructura del sistema.';

// Se consulta en la BD (y no en el token) para que un cambio de permisos aplique de inmediato
async function roleCanManageStructure(roleId: number): Promise<boolean> {
    const role = await prisma.role.findUnique({
        where: { id: roleId },
        select: { can_manage_structure: true }
    });
    return role?.can_manage_structure === true;
}

// needsPermission decide, según la petición, si hay que revisar el permiso.
export const requireStructurePermissionWhen =
    (needsPermission: (req: Request) => boolean, forbiddenMessage = DEFAULT_FORBIDDEN_MESSAGE): RequestHandler =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        if (!needsPermission(req)) {
            next();
            return;
        }

        const roleId = req.user?.roleId;
        if (!roleId) {
            res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
            return;
        }

        try {
            if (!(await roleCanManageStructure(roleId))) {
                res.status(403).json({ error: forbiddenMessage });
                return;
            }
            next();
        } catch (error) {
            next(error);
        }
    };

// Versión de siempre: exige el permiso en toda petición (mismo comportamiento que antes)
export const requireStructurePermission = requireStructurePermissionWhen(() => true);
