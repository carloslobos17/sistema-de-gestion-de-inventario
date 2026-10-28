// src/modules/suppliers/supplier.controller.ts
import { Request, Response } from 'express';
import { SupplierService } from './supplier.service';
import { AppError } from '../../utils/AppError';
import { supplierFiltersSchema } from './supplier.schema';
import type { UpdateSupplierInput } from './supplier.schema';
import type { SupplierData } from './supplier.types';

const supplierService = new SupplierService();

function handleError(res: Response, error: any, context: string): void {
    if (error instanceof AppError) {
        res.status(error.status).json({ error: error.message });
        return;
    }

    // Prisma: violación de UNIQUE (por si dos personas guardan los mismos datos al mismo tiempo)
    if (error?.code === 'P2002') {
        res.status(409).json({ error: 'Ya existe un proveedor con esos datos (nombre, documento o NRC)' });
        return;
    }

    // Prisma: el distrito o la actividad económica enviados no existen en los catálogos
    if (error?.code === 'P2003') {
        res.status(400).json({ error: 'La ubicación o la actividad económica seleccionada no existe' });
        return;
    }

    console.error(`[SupplierController - ${context}] Error interno:`, error);
    res.status(500).json({ error: 'Error interno del servidor. Contacte al administrador.' });
}

export class SupplierController {
    // GET /api/suppliers?search=&is_active=&supplier_type=&page=&limit=  →  { data, meta }
    async list(req: Request, res: Response): Promise<void> {
        // Se valida aquí porque en Express 5 req.query no se puede reemplazar
        const parsed = supplierFiltersSchema.safeParse(req.query);

        if (!parsed.success) {
            res.status(400).json({
                error: 'Filtros inválidos',
                details: parsed.error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            });
            return;
        }

        const { page, limit, ...filters } = parsed.data;

        try {
            const result = await supplierService.list(filters, { page, limit });
            res.status(200).json(result);
        } catch (error) {
            handleError(res, error, 'list');
        }
    }

    // GET /api/suppliers/options  →  [{ id, name }] de los proveedores activos (para selects, ej. compras)
    async options(_req: Request, res: Response): Promise<void> {
        try {
            const options = await supplierService.listOptions();
            res.status(200).json({ data: options });
        } catch (error) {
            handleError(res, error, 'options');
        }
    }

    // GET /api/suppliers/:id
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const supplier = await supplierService.getById(Number(req.params.id));
            res.status(200).json({ data: supplier });
        } catch (error) {
            handleError(res, error, 'getById');
        }
    }

    // POST /api/suppliers
    async create(req: Request, res: Response): Promise<void> {
        try {
            const supplier = await supplierService.create(req.body as SupplierData); // ya validado y completo por supplierDataSchema
            res.status(201).json({ message: 'Proveedor creado exitosamente', data: supplier });
        } catch (error) {
            handleError(res, error, 'create');
        }
    }

    // PATCH /api/suppliers/:id
    async update(req: Request, res: Response): Promise<void> {
        try {
            const supplier = await supplierService.update(Number(req.params.id), req.body as UpdateSupplierInput);
            res.status(200).json({ message: 'Proveedor actualizado exitosamente', data: supplier });
        } catch (error) {
            handleError(res, error, 'update');
        }
    }

    // DELETE /api/suppliers/:id (borrado lógico)
    async remove(req: Request, res: Response): Promise<void> {
        try {
            await supplierService.remove(Number(req.params.id));
            res.status(200).json({ message: 'Proveedor desactivado exitosamente' });
        } catch (error) {
            handleError(res, error, 'remove');
        }
    }
}
