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

export default router;