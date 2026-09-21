import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

// GET: /api/usuarios
router.get('/', authenticateToken, (req, res) => userController.listar(req, res));

export default router;