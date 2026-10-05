import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';
import { validateSchema } from '../../middlewares/validator.middleware';
import { requireAdmin } from '../../middlewares/requireAdmin.middleware';
import { createUserSchema, updateUserSchema, userIdParamSchema } from './user.schema';

const router = Router();
const userController = new UserController();

// GET: /api/users?search=&role_id=&is_active=
router.get('/', authenticateToken, requireAdmin, (req, res) => userController.list(req, res));

// GET: /api/users/:id  (para precargar el formulario de edición)
router.get(
    '/:id',
    authenticateToken,
    requireAdmin,
    validateSchema(userIdParamSchema, 'params'),
    (req, res) => userController.getById(req, res)
);

// POST: /api/users
router.post(
    '/',
    authenticateToken,
    requireAdmin,
    validateSchema(createUserSchema),
    (req, res) => userController.create(req, res)
);

// PATCH: /api/users/:id  (edición parcial: solo se envían los campos a cambiar)
router.patch(
    '/:id',
    authenticateToken,
    requireAdmin,
    validateSchema(userIdParamSchema, 'params'),
    validateSchema(updateUserSchema),
    (req, res) => userController.update(req, res)
);

// DELETE: /api/users/:id  (borrado lógico: is_active = false)
router.delete(
    '/:id',
    authenticateToken,
    requireAdmin,
    validateSchema(userIdParamSchema, 'params'),
    (req, res) => userController.remove(req, res)
);

export default router;