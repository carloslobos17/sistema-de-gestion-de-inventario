import { Request, Response } from 'express';
import { UserService } from './user.service';
import { AppError } from '../../utils/AppError';
import { userFiltersSchema } from './user.schema';
import type { CreateUserInput, UpdateUserInput } from './user.schema';

const userService = new UserService();

const getCurrentUserId = (req: Request): number | undefined => req.user?.userId;

function handleError(res: Response, error: any, context: string): void {
    if (error instanceof AppError) {
        res.status(error.status).json({ error: error.message });
        return;
    }

    // Prisma: el role_id enviado no existe en la tabla de roles
    if (error?.code === 'P2003') {
        res.status(400).json({ error: 'El rol seleccionado no existe' });
        return;
    }

    console.error(`[UserController - ${context}] Error interno:`, error);
    res.status(500).json({ error: 'Error interno del servidor. Contacte al administrador.' });
}

export class UserController {
    // GET /api/users?search=ana&role_id=2&is_active=true
    async list(req: Request, res: Response): Promise<void> {
        // Se valida aquí y no con validateSchema porque en Express 5 req.query no se puede reemplazar
        const parsed = userFiltersSchema.safeParse(req.query);

        if (!parsed.success) {
            res.status(400).json({
                error: 'Filtros inválidos',
                details: parsed.error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            });
            return;
        }

        try {
            const users = await userService.list(parsed.data);
            res.status(200).json({ data: users });
        } catch (error) {
            handleError(res, error, 'list');
        }
    }

    // GET /api/users/:id
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const user = await userService.getById(id);

            res.status(200).json({ data: user });
        } catch (error) {
            handleError(res, error, 'getById');
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body as CreateUserInput;
            const user = await userService.create(data);

            res.status(201).json({ message: 'Usuario creado exitosamente', data: user });
        } catch (error) {
            handleError(res, error, 'create');
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const data = req.body as UpdateUserInput;
            const user = await userService.update(id, data, getCurrentUserId(req));

            res.status(200).json({ message: 'Usuario actualizado exitosamente', data: user });
        } catch (error) {
            handleError(res, error, 'update');
        }
    }

    async remove(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            await userService.remove(id, getCurrentUserId(req));

            res.status(200).json({ message: 'Usuario eliminado exitosamente' });
        } catch (error) {
            handleError(res, error, 'remove');
        }
    }
}