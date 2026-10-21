// src/modules/categories/category.routes.ts
// Lectura: cualquier usuario con sesión (el vendedor necesita verlas al registrar productos).
// Escritura: solo roles con can_manage_structure = true.
import { Router } from 'express';
import { CategoryController } from './category.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';
import { validateSchema } from '../../middlewares/validator.middleware';
import { requireStructurePermission } from '../../middlewares/requireStructurePermission.middleware';
import { categoryIdParamSchema, createCategorySchema, updateCategorySchema } from './category.schema';

const router = Router();
const categoryController = new CategoryController();

// GET: /api/categories?search=&is_active=&page=&limit=  (tabla, paginado)
router.get('/', authenticateToken, (req, res) => categoryController.list(req, res));

// GET: /api/categories/options  (selects: solo activas, solo id y nombre)
// Debe ir ANTES de '/:id', si no Express tomaría "options" como un id.
router.get('/options', authenticateToken, (req, res) => categoryController.options(req, res));

// GET: /api/categories/:id
router.get(
    '/:id',
    authenticateToken,
    validateSchema(categoryIdParamSchema, 'params'),
    (req, res) => categoryController.getById(req, res)
);

// POST: /api/categories
router.post(
    '/',
    authenticateToken,
    requireStructurePermission,
    validateSchema(createCategorySchema),
    (req, res) => categoryController.create(req, res)
);

// PATCH: /api/categories/:id  (renombrar y/o activar-desactivar)
router.patch(
    '/:id',
    authenticateToken,
    requireStructurePermission,
    validateSchema(categoryIdParamSchema, 'params'),
    validateSchema(updateCategorySchema),
    (req, res) => categoryController.update(req, res)
);

// DELETE: /api/categories/:id  (borrado lógico: is_active = false)
router.delete(
    '/:id',
    authenticateToken,
    requireStructurePermission,
    validateSchema(categoryIdParamSchema, 'params'),
    (req, res) => categoryController.remove(req, res)
);

export default router;
