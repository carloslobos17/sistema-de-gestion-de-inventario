// src/modules/brands/brand.repository.ts
import { prisma } from '../../config/db';
import type { Brand, BrandFilters, CreateBrandData, UpdateBrandData } from './brand.types';

// Tipo del "where" de Prisma para marcas, sacado de tu propio cliente
type BrandWhere = NonNullable<NonNullable<Parameters<typeof prisma.brand.findMany>[0]>['where']>;

const BRAND_SELECT = {
    id: true,
    name: true,
    is_active: true
} as const;

export class BrandRepository {
    async findAll(filters: BrandFilters = {}): Promise<Brand[]> {
        const where: BrandWhere = {};

        if (filters.is_active !== undefined) {
            where.is_active = filters.is_active;
        }

        if (filters.search) {
            where.name = { contains: filters.search };
        }

        return prisma.brand.findMany({
            where,
            select: BRAND_SELECT,
            orderBy: { name: 'asc' }
        });
    }

    async findById(id: number): Promise<Brand | null> {
        return prisma.brand.findUnique({
            where: { id },
            select: BRAND_SELECT
        });
    }

    // En MySQL la comparación ignora mayúsculas, así "ACME" y "acme" cuentan como la misma marca.
    // excludeId permite que una marca "se renombre" a su mismo nombre al editar.
    async existsByName(name: string, excludeId?: number): Promise<boolean> {
        const brand = await prisma.brand.findUnique({
            where: { name },
            select: { id: true }
        });
        return brand !== null && brand.id !== excludeId;
    }

    async create(data: CreateBrandData): Promise<Brand> {
        return prisma.brand.create({
            data,
            select: BRAND_SELECT
        });
    }

    async update(id: number, data: UpdateBrandData): Promise<Brand> {
        return prisma.brand.update({
            where: { id },
            data,
            select: BRAND_SELECT
        });
    }
}
