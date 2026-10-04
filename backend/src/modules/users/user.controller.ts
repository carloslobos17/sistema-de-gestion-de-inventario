import { Request, Response } from 'express';
import { UserService } from './user.service';
import { CreateUserInput } from './user.schema';

const userService = new UserService();

export class UserController {
    async list(_req: Request, res: Response): Promise<void> {
        try {
            const users = await userService.list();
            res.status(200).json({ data: users });
        } catch (error) {
            console.error('[UserController - list] Error interno:', error);
            res.status(500).json({ error: 'Error interno del servidor. Contacte al administrador.' });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const validatedData = req.body as CreateUserInput;
            const user = await userService.create(validatedData);

            res.status(201).json({ message: 'Usuario creado exitosamente', data: user });
        } catch (error: any) {
            if (error.message === 'El nombre de usuario ya está en uso') {
                res.status(400).json({ error: error.message });
                return;
            }
            console.error('[UserController - create] Error interno:', error);
            res.status(500).json({ error: 'Error interno del servidor. Contacte al administrador.' });
        }
    }
}