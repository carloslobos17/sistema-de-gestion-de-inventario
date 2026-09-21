import { Request, Response } from 'express';
import { UserService } from './user.service';
import { CrearUsuarioInput } from './user.schema';

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

    async crear(req: Request, res: Response): Promise<void> {
        try {
            const datosValidados = req.body as CrearUsuarioInput;
            const usuario = await userService.crear(datosValidados);

            res.status(201).json({mensaje: 'Usuario creado exitosamente', datos: usuario });
        } catch (error: any) {
            if (error.message === 'El nombre de usuario ya está en uso') {
                res.status(400).json({ error: error.message });
                return;
            }
            console.error('[UserController - crear] Error interno:', error);
            res.status(500).json({ error: 'Error interno del servidor. Contacte al administrador.' });
        }
    }
}