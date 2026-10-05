// src/modules/brands/brand.controller.ts
import { Request, Response } from 'express';
import { BrandService } from './brand.service';
import { AppError } from '../../utils/AppError';
import { brandFiltersSchema } from './brand.schema';
import type { CreateBrandInput, UpdateBrandInput } from './brand.schema';

const brandService = new BrandService();

function handleError(res: Response, error: any, context: string): void {
    if (error instanceof AppError) {
        res.status(error.status).json({ error: error.message });
        return;
    }

    // Prisma: violación de UNIQUE (por si dos personas crean la misma marca al mismo tiempo)
    if (error?.code === 'P2002') {
        res.status(409).json({ error: 'Ya existe una marca con ese nombre' });
        return;
    }

    console.error(`[BrandController - ${context}] Error interno:`, error);
    res.status(500).json({ error: 'Error interno del servidor. Contacte al administrador.' });
}

export class BrandController {
    // GET /api/brands?search=&is_active=
    async list(req: Request, res: Response): Promise<void> {
        // Se valida aquí porque en Express 5 req.query no se puede reemplazar
        const parsed = brandFiltersSchema.safeParse(req.query);

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

        try {
            const brands = await brandService.list(parsed.data);
            res.status(200).json({ data: brands });
        } catch (error) {
            handleError(res, error, 'list');
        }
    }

    // GET /api/brands/:id
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const brand = await brandService.getById(Number(req.params.id));
            res.status(200).json({ data: brand });
        } catch (error) {
            handleError(res, error, 'getById');
        }
    }

    // POST /api/brands
    async create(req: Request, res: Response): Promise<void> {
        try {
            const brand = await brandService.create(req.body as CreateBrandInput);
            res.status(201).json({ message: 'Marca creada exitosamente', data: brand });
        } catch (error) {
            handleError(res, error, 'create');
        }
    }

    // PATCH /api/brands/:id
    async update(req: Request, res: Response): Promise<void> {
        try {
            const brand = await brandService.update(Number(req.params.id), req.body as UpdateBrandInput);
            res.status(200).json({ message: 'Marca actualizada exitosamente', data: brand });
        } catch (error) {
            handleError(res, error, 'update');
        }
    }

    // DELETE /api/brands/:id (borrado lógico)
    async remove(req: Request, res: Response): Promise<void> {
        try {
            await brandService.remove(Number(req.params.id));
            res.status(200).json({ message: 'Marca desactivada exitosamente' });
        } catch (error) {
            handleError(res, error, 'remove');
        }
    }
}
