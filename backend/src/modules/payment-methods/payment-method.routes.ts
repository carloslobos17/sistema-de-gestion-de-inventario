// src/modules/payment-methods/payment-method.routes.ts
// Catálogo CAT-017 de solo lectura: cualquier usuario con sesión lo puede consultar (el vendedor lo usa al cobrar).
import { Router } from 'express';
import { PaymentMethodController } from './payment-method.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = Router();
const paymentMethodController = new PaymentMethodController();

// GET: /api/payment-methods
router.get('/', authenticateToken, (req, res) => paymentMethodController.list(req, res));

export default router;
