// src/modules/auth/auth.controller.ts
// Recibe las peticiones de sesión. El refresh token entra y sale solo por la cookie httpOnly.
import type { Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { authService } from './auth.service';
import { clearRefreshCookie, readRefreshCookie, setRefreshCookie } from './auth.cookie';
import type { AuthSession, LoginCredentials } from './auth.types';

function handleError(res: Response, error: unknown, fallback: string): void {
    if (error instanceof AppError) {
        res.status(error.status).json({ error: error.message });
        return;
    }
    console.error(error);
    res.status(500).json({ error: fallback });
}

// Login y refresh responden igual: refresh token en la cookie, usuario y access token en el JSON
function sendSession(res: Response, session: AuthSession, message: string): void {
    setRefreshCookie(res, session.refreshToken, session.refreshExpiresAt);
    res.status(200).json({
        message,
        data: { user: session.user, accessToken: session.accessToken },
    });
}

export class AuthController {
    async login(req: Request, res: Response): Promise<void> {
        try {
            const session = await authService.login(req.body as LoginCredentials);
            sendSession(res, session, 'Inicio de sesión exitoso');
        } catch (error) {
            handleError(res, error, 'Error al iniciar sesión');
        }
    }

    // Si falla NO se borra la cookie: otra pestaña pudo haberla renovado un instante antes
    async refresh(req: Request, res: Response): Promise<void> {
        try {
            const session = await authService.refresh(readRefreshCookie(req));
            sendSession(res, session, 'Sesión renovada');
        } catch (error) {
            handleError(res, error, 'Error al renovar la sesión');
        }
    }

    // La cookie se borra siempre, aunque falle la BD: el usuario quiere salir
    async logout(req: Request, res: Response): Promise<void> {
        try {
            await authService.logout(readRefreshCookie(req));
            clearRefreshCookie(res);
            res.status(200).json({ message: 'Sesión cerrada' });
        } catch (error) {
            clearRefreshCookie(res);
            handleError(res, error, 'Error al cerrar sesión');
        }
    }
}

export const authController = new AuthController();