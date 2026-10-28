// src/modules/locations/location.routes.ts
// Catálogos geográficos de Hacienda: solo lectura, para cualquier usuario con sesión.
import { Router } from 'express';
import { LocationController } from './location.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = Router();
const locationController = new LocationController();

// GET: /api/locations
router.get('/', authenticateToken, (req, res) => locationController.tree(req, res));

export default router;
