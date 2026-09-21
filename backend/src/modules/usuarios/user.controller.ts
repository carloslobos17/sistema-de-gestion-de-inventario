import { Request, Response } from 'express';
import { UserService } from './user.service';

const userService = new UserService();

export class UserController {
    async listar(_req: Request, res: Response): Promise<void> {
        try {
            const usuarios = await userService.listar();
            res.status(200).json({ datos: usuarios });
        } catch (error) {
            console.error('[UserController - listar] Error interno:', error);
            res.status(500).json({ error: 'Error interno del servidor. Contacte al administrador.' });
        }
    }
}