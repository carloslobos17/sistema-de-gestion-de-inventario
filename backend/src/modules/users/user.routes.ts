import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';
import { validateSchema } from '../../middlewares/validator.middleware';
import { requireAdmin } from '../../middlewares/requireAdmin.middleware';
import { createUserSchema } from './user.schema';

const router = Router();
const userController = new UserController();

// GET: /api/usuarios
router.get('/', authenticateToken, (req, res) => userController.list(req, res));

// POST: /api/usuarios
router.post('/', authenticateToken, requireAdmin, validateSchema(createUserSchema), (req, res) => userController.create(req, res));

export default router;