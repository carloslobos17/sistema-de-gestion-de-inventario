import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';
import { validateSchema } from '../../middlewares/validator.middleware';
import { requireAdmin } from '../../middlewares/requireAdmin.middleware';
import { crearUsuarioSchema } from './user.schema';

const router = Router();
const userController = new UserController();

// GET: /api/usuarios
router.get('/', authenticateToken, (req, res) => userController.listar(req, res));

// POST: /api/usuarios
router.post('/', authenticateToken, requireAdmin, validateSchema(crearUsuarioSchema), (req, res) => userController.crear(req, res));

export default router;