// src/modules/categories/category.repository.ts
import { prisma } from '../../config/db';
import { getSkip, toPaginationMeta } from '../../utils/pagination';
import type { PaginatedResult, PaginationParams } from '../../types/pagination.types';
import type { Category, CategoryFilters, CategoryOption, CreateCategoryData, UpdateCategoryData } from './category.types';

// Tipo del "where" de Prisma para categorías, sacado de tu propio cliente
type CategoryWhere = NonNullable<NonNullable<Parameters<typeof prisma.category.findMany>[0]>['where']>;

const CATEGORY_SELECT = {
    id: true,
    name: true,
    is_active: true
} as const;

export class CategoryRepository {
    // Una página del listado + el total. Usa el índice (is_active, name).
    async findPage(filters: CategoryFilters, pagination: PaginationParams): Promise<PaginatedResult<Category>> {
        const where: CategoryWhere = {};

        if (filters.is_active !== undefined) {
            where.is_active = filters.is_active;
        }

        if (filters.search) {
            where.name = { contains: filters.search };
        }

        // Las dos consultas en una transacción para que el total cuadre con los datos
        const [data, total] = await prisma.$transaction([
            prisma.category.findMany({
                where,
                select: CATEGORY_SELECT,
                orderBy: { name: 'asc' },
                skip: getSkip(pagination),
                take: pagination.limit
            }),
            prisma.category.count({ where })
        ]);

        return { data, meta: toPaginationMeta(pagination, total) };
    }

    // Para los selects: solo activas, solo id y nombre, sin paginar ni contar
    async findOptions(): Promise<CategoryOption[]> {
        return prisma.category.findMany({
            where: { is_active: true },
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        });
    }

    async findById(id: number): Promise<Category | null> {
        return prisma.category.findUnique({
            where: { id },
            select: CATEGORY_SELECT
        });
    }

    // En MySQL la comparación ignora mayúsculas, así "PINTURAS" y "pinturas" cuentan como la misma categoría.
    // excludeId permite que una categoría "se renombre" a su mismo nombre al editar.
    async existsByName(name: string, excludeId?: number): Promise<boolean> {
        const category = await prisma.category.findUnique({
            where: { name },
            select: { id: true }
        });
        return category !== null && category.id !== excludeId;
    }

    async create(data: CreateCategoryData): Promise<Category> {
        return prisma.category.create({
            data,
            select: CATEGORY_SELECT
        });
    }

    async update(id: number, data: UpdateCategoryData): Promise<Category> {
        return prisma.category.update({
            where: { id },
            data,
            select: CATEGORY_SELECT
        });
    }
}
