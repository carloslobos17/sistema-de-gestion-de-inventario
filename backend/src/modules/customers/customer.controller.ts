// src/modules/customers/customer.controller.ts
import { Request, Response } from 'express';
import { CustomerService } from './customer.service';
import { AppError } from '../../utils/AppError';
import { customerFiltersSchema } from './customer.schema';
import type { UpdateCustomerInput } from './customer.schema';
import type { CustomerData } from './customer.types';

const customerService = new CustomerService();

function handleError(res: Response, error: any, context: string): void {
    if (error instanceof AppError) {
        res.status(error.status).json({ error: error.message });
        return;
    }

    // Prisma: violación de UNIQUE (por si dos personas guardan los mismos datos al mismo tiempo)
    if (error?.code === 'P2002') {
        res.status(409).json({ error: 'Ya existe un cliente con ese documento o NRC' });
        return;
    }

    // Prisma: el distrito o la actividad económica enviados no existen en los catálogos
    if (error?.code === 'P2003') {
        res.status(400).json({ error: 'La ubicación o la actividad económica seleccionada no existe' });
        return;
    }

    console.error(`[CustomerController - ${context}] Error interno:`, error);
    res.status(500).json({ error: 'Error interno del servidor. Contacte al administrador.' });
}

export class CustomerController {
    // GET /api/customers?search=&is_active=&customer_type=&page=&limit=  →  { data, meta }
    async list(req: Request, res: Response): Promise<void> {
        // Se valida aquí porque en Express 5 req.query no se puede reemplazar
        const parsed = customerFiltersSchema.safeParse(req.query);

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
            const result = await customerService.list(filters, { page, limit });
            res.status(200).json(result);
        } catch (error) {
            handleError(res, error, 'list');
        }
    }

    // GET /api/customers/:id
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const customer = await customerService.getById(Number(req.params.id));
            res.status(200).json({ data: customer });
        } catch (error) {
            handleError(res, error, 'getById');
        }
    }

    // POST /api/customers
    async create(req: Request, res: Response): Promise<void> {
        try {
            const customer = await customerService.create(req.body as CustomerData); // ya validado y completo por customerDataSchema
            res.status(201).json({ message: 'Cliente creado exitosamente', data: customer });
        } catch (error) {
            handleError(res, error, 'create');
        }
    }

    // PATCH /api/customers/:id
    async update(req: Request, res: Response): Promise<void> {
        try {
            const customer = await customerService.update(Number(req.params.id), req.body as UpdateCustomerInput);
            res.status(200).json({ message: 'Cliente actualizado exitosamente', data: customer });
        } catch (error) {
            handleError(res, error, 'update');
        }
    }

    // DELETE /api/customers/:id (borrado lógico)
    async remove(req: Request, res: Response): Promise<void> {
        try {
            await customerService.remove(Number(req.params.id));
            res.status(200).json({ message: 'Cliente desactivado exitosamente' });
        } catch (error) {
            handleError(res, error, 'remove');
        }
    }
}
