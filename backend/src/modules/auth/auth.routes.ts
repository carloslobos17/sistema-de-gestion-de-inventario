// src/modules/auth/auth.routes.ts
// Rutas de sesión: login, renovación del access token y cierre de sesión.
import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateSchema } from '../../middlewares/validator.middleware';
import { loginSchema } from './auth.schema';

const router = Router();
const authController = new AuthController();

// POST: /api/auth/login
router.post(
    '/login',
    validateSchema(loginSchema), // 1. Primero pasa por el validador (Zod)
    (req, res) => authController.login(req, res) // 2. Si todo está bien, entra al controlador
);

// POST: /api/auth/refresh y /api/auth/logout
// Sin authenticateToken: el access token puede estar vencido justo cuando se renueva
router.post('/refresh', (req, res) => authController.refresh(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));

export default router;