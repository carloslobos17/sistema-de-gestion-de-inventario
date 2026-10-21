// src/utils/pagination.ts
// Validación y cálculos de la paginación. Lo usan todos los listados paginados.
import { z } from 'zod';
import type { PaginationMeta, PaginationParams } from '../types/pagination.types';

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100; // nadie puede pedir la tabla entera en una sola petición

// Campos ?page=&limit= (llegan como texto en la URL). Se agregan a los filtros de cada módulo.
export const paginationQuerySchema = z.object({
    page: z.coerce
        .number({ message: 'page debe ser un número' })
        .int('page debe ser un número entero')
        .min(1, 'page debe ser 1 o mayor')
        .default(1),
    limit: z.coerce
        .number({ message: 'limit debe ser un número' })
        .int('limit debe ser un número entero')
        .min(1, 'limit debe ser 1 o mayor')
        .max(MAX_PAGE_SIZE, `limit no puede ser mayor que ${MAX_PAGE_SIZE}`)
        .default(DEFAULT_PAGE_SIZE)
});

// Cuántas filas saltar para llegar a la página pedida (página 3 de 10 → salta 20)
export function getSkip({ page, limit }: PaginationParams): number {
    return (page - 1) * limit;
}

export function toPaginationMeta({ page, limit }: PaginationParams, total: number): PaginationMeta {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    };
}
