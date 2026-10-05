// src/modules/brands/brand.routes.ts
// Lectura: cualquier usuario con sesión (el vendedor necesita ver las marcas).
// Escritura: solo roles con can_manage_structure = true.
import { Router } from 'express';
import { BrandController } from './brand.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';
import { validateSchema } from '../../middlewares/validator.middleware';
import { requireStructurePermission } from '../../middlewares/requireStructurePermission.middleware';
import { brandIdParamSchema, createBrandSchema, updateBrandSchema } from './brand.schema';

const router = Router();
const brandController = new BrandController();

// GET: /api/brands?search=&is_active=
router.get('/', authenticateToken, (req, res) => brandController.list(req, res));

// GET: /api/brands/:id
router.get(
    '/:id',
    authenticateToken,
    validateSchema(brandIdParamSchema, 'params'),
    (req, res) => brandController.getById(req, res)
);

// POST: /api/brands
router.post(
    '/',
    authenticateToken,
    requireStructurePermission,
    validateSchema(createBrandSchema),
    (req, res) => brandController.create(req, res)
);

// PATCH: /api/brands/:id  (renombrar y/o activar-desactivar)
router.patch(
    '/:id',
    authenticateToken,
    requireStructurePermission,
    validateSchema(brandIdParamSchema, 'params'),
    validateSchema(updateBrandSchema),
    (req, res) => brandController.update(req, res)
);

// DELETE: /api/brands/:id  (borrado lógico: is_active = false)
router.delete(
    '/:id',
    authenticateToken,
    requireStructurePermission,
    validateSchema(brandIdParamSchema, 'params'),
    (req, res) => brandController.remove(req, res)
);

export default router;
