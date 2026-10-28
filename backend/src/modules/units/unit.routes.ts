// src/modules/units/unit.routes.ts
// Catálogo fijo de Hacienda: solo lectura, para cualquier usuario con sesión. No hay crear/editar/desactivar.
import { Router } from 'express';
import { UnitController } from './unit.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = Router();
const unitController = new UnitController();

// GET: /api/units
router.get('/', authenticateToken, (req, res) => unitController.list(req, res));

export default router;
