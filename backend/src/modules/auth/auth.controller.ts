// src/modules/auth/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AppError } from '../../utils/AppError';
import type { LoginInput } from './auth.schema';

const authService = new AuthService();

function handleError(res: Response, error: unknown, context: string): void {
    if (error instanceof AppError) {
        res.status(error.status).json({ error: error.message });
        return;
    }

    console.error(`[AuthController - ${context}] Error interno:`, error);
    res.status(500).json({ error: 'Error interno del servidor. Contacte al administrador.' });
}

export class AuthController {
    // POST /api/auth/login
    async login(req: Request, res: Response): Promise<void> {
        try {
            const result = await authService.login(req.body as LoginInput);
            res.status(200).json({ message: 'Inicio de sesión exitoso', data: result });
        } catch (error) {
            handleError(res, error, 'login');
        }
    }
}
