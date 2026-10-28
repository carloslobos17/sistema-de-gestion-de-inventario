// src/modules/economic-activities/economic-activity.routes.ts
// Catálogo fijo de Hacienda: solo lectura, para cualquier usuario con sesión. No hay crear/editar/desactivar.
import { Router } from 'express';
import { EconomicActivityController } from './economic-activity.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = Router();
const economicActivityController = new EconomicActivityController();

// GET: /api/economic-activities
router.get('/', authenticateToken, (req, res) => economicActivityController.list(req, res));

export default router;
