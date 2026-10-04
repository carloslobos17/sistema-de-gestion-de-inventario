import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginInput } from './auth.schema';

// Instanciamos el servicio
const authService = new AuthService();

export class AuthController {
    async login(req: Request, res: Response): Promise<void> {
        try {
            const validatedData = req.body as LoginInput;

            const result = await authService.login(validatedData);

            // Responder al frontend con los tokens y datos del usuario
            res.status(200).json({
                message: 'Inicio de sesión exitoso',
                data: result
            });

        } catch (error: any) {
            // Manejo de Errores de Lógica de Negocio
            if (error.message === 'Credenciales inválidas') {
                res.status(401).json({ error: error.message });
                return;
            }

            // Errores imprevistos (Fallas de base de datos, caídas del servidor, etc.)
            console.error('[AuthController - login] Error interno:', error);
            res.status(500).json({ error: 'Error interno del servidor. Contacte al administrador.' });
        }
    }
}