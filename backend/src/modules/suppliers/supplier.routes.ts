// src/modules/suppliers/supplier.routes.ts
// Lectura: cualquier usuario con sesión (se necesita al registrar compras).
// Escritura: solo roles con can_manage_structure = true.
import { Router } from 'express';
import { SupplierController } from './supplier.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';
import { validateSchema } from '../../middlewares/validator.middleware';
import { requireStructurePermission } from '../../middlewares/requireStructurePermission.middleware';
import { supplierDataSchema, supplierIdParamSchema, updateSupplierSchema } from './supplier.schema';

const router = Router();
const supplierController = new SupplierController();

// GET: /api/suppliers?search=&is_active=&supplier_type=&page=&limit=  (tabla, paginado)
router.get('/', authenticateToken, (req, res) => supplierController.list(req, res));

// GET: /api/suppliers/options  (selects: solo activos, solo id y nombre)
// Debe ir ANTES de '/:id', si no Express tomaría "options" como un id.
router.get('/options', authenticateToken, (req, res) => supplierController.options(req, res));

// GET: /api/suppliers/:id
router.get(
    '/:id',
    authenticateToken,
    validateSchema(supplierIdParamSchema, 'params'),
    (req, res) => supplierController.getById(req, res)
);

// POST: /api/suppliers
router.post(
    '/',
    authenticateToken,
    requireStructurePermission,
    validateSchema(supplierDataSchema), // reglas según el tipo (contribuyente / sujeto excluido)
    (req, res) => supplierController.create(req, res)
);

// PATCH: /api/suppliers/:id  (edición parcial y/o activar-desactivar)
router.patch(
    '/:id',
    authenticateToken,
    requireStructurePermission,
    validateSchema(supplierIdParamSchema, 'params'),
    validateSchema(updateSupplierSchema),
    (req, res) => supplierController.update(req, res)
);

// DELETE: /api/suppliers/:id  (borrado lógico: is_active = false)
router.delete(
    '/:id',
    authenticateToken,
    requireStructurePermission,
    validateSchema(supplierIdParamSchema, 'params'),
    (req, res) => supplierController.remove(req, res)
);

export default router;
