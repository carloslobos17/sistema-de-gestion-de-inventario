// src/modules/customers/customer.routes.ts
// Ver, crear y editar: cualquier usuario con sesión (el vendedor registra clientes en caja).
// Límite de crédito, desactivar y reactivar: solo roles con can_manage_structure = true.
import { Router, type Request } from 'express';
import { CustomerController } from './customer.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';
import { validateSchema } from '../../middlewares/validator.middleware';
import {
    requireStructurePermission,
    requireStructurePermissionWhen
} from '../../middlewares/requireStructurePermission.middleware';
import { customerDataSchema, customerIdParamSchema, updateCustomerSchema } from './customer.schema';

const router = Router();
const customerController = new CustomerController();

// ¿La petición trae campos que solo puede tocar can_manage_structure? (se revisa el body tal como llegó)
const sendsCreditLimit = (req: Request) => req.body?.credit_limit !== undefined;
const sendsRestrictedChanges = (req: Request) => sendsCreditLimit(req) || req.body?.is_active !== undefined;

// GET: /api/customers?search=&is_active=&customer_type=&page=&limit=  (tabla, paginado)
router.get('/', authenticateToken, (req, res) => customerController.list(req, res));

// GET: /api/customers/:id
router.get(
    '/:id',
    authenticateToken,
    validateSchema(customerIdParamSchema, 'params'),
    (req, res) => customerController.getById(req, res)
);

// POST: /api/customers  (si no trae credit_limit, queda en 0)
router.post(
    '/',
    authenticateToken,
    requireStructurePermissionWhen(sendsCreditLimit, 'Solo un usuario con permisos de estructura puede asignar el límite de crédito.'),
    validateSchema(customerDataSchema), // reglas según el tipo (consumidor final / contribuyente)
    (req, res) => customerController.create(req, res)
);

// PATCH: /api/customers/:id  (edición parcial; credit_limit e is_active requieren permiso)
router.patch(
    '/:id',
    authenticateToken,
    requireStructurePermissionWhen(
        sendsRestrictedChanges,
        'Solo un usuario con permisos de estructura puede cambiar el límite de crédito o el estado del cliente.'
    ),
    validateSchema(customerIdParamSchema, 'params'),
    validateSchema(updateCustomerSchema),
    (req, res) => customerController.update(req, res)
);

// DELETE: /api/customers/:id  (borrado lógico: is_active = false)
router.delete(
    '/:id',
    authenticateToken,
    requireStructurePermission,
    validateSchema(customerIdParamSchema, 'params'),
    (req, res) => customerController.remove(req, res)
);

export default router;
