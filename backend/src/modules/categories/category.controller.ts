// src/modules/categories/category.controller.ts
import { Request, Response } from 'express';
import { CategoryService } from './category.service';
import { AppError } from '../../utils/AppError';
import { categoryFiltersSchema } from './category.schema';
import type { CreateCategoryInput, UpdateCategoryInput } from './category.schema';

const categoryService = new CategoryService();

function handleError(res: Response, error: any, context: string): void {
    if (error instanceof AppError) {
        res.status(error.status).json({ error: error.message });
        return;
    }

    // Prisma: violación de UNIQUE (por si dos personas crean la misma categoría al mismo tiempo)
    if (error?.code === 'P2002') {
        res.status(409).json({ error: 'Ya existe una categoría con ese nombre' });
        return;
    }

    console.error(`[CategoryController - ${context}] Error interno:`, error);
    res.status(500).json({ error: 'Error interno del servidor. Contacte al administrador.' });
}

export class CategoryController {
    // GET /api/categories?search=&is_active=&page=&limit=  →  { data, meta }
    async list(req: Request, res: Response): Promise<void> {
        // Se valida aquí porque en Express 5 req.query no se puede reemplazar
        const parsed = categoryFiltersSchema.safeParse(req.query);

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
            const result = await categoryService.list(filters, { page, limit });
            res.status(200).json(result);
        } catch (error) {
            handleError(res, error, 'list');
        }
    }

    // GET /api/categories/options  →  [{ id, name }] de las categorías activas (para selects)
    async options(_req: Request, res: Response): Promise<void> {
        try {
            const options = await categoryService.listOptions();
            res.status(200).json({ data: options });
        } catch (error) {
            handleError(res, error, 'options');
        }
    }

    // GET /api/categories/:id
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const category = await categoryService.getById(Number(req.params.id));
            res.status(200).json({ data: category });
        } catch (error) {
            handleError(res, error, 'getById');
        }
    }

    // POST /api/categories
    async create(req: Request, res: Response): Promise<void> {
        try {
            const category = await categoryService.create(req.body as CreateCategoryInput);
            res.status(201).json({ message: 'Categoría creada exitosamente', data: category });
        } catch (error) {
            handleError(res, error, 'create');
        }
    }

    // PATCH /api/categories/:id
    async update(req: Request, res: Response): Promise<void> {
        try {
            const category = await categoryService.update(Number(req.params.id), req.body as UpdateCategoryInput);
            res.status(200).json({ message: 'Categoría actualizada exitosamente', data: category });
        } catch (error) {
            handleError(res, error, 'update');
        }
    }

    // DELETE /api/categories/:id (borrado lógico)
    async remove(req: Request, res: Response): Promise<void> {
        try {
            await categoryService.remove(Number(req.params.id));
            res.status(200).json({ message: 'Categoría desactivada exitosamente' });
        } catch (error) {
            handleError(res, error, 'remove');
        }
    }
}
