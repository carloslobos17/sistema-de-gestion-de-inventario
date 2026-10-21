// src/api/api.types.ts
// Forma común de las respuestas del backend. La comparten todos los módulos (usuarios, clientes, inventario...).
import type { PaginationMeta } from '../types/common';

// Respuesta exitosa: { data, message? }
export interface ApiResponse<T> {
    data: T;
    message?: string;
}

// Respuesta de un listado paginado: { data: [...], meta: { page, limit, total, totalPages } }
export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

// Respuesta de error: { error, details? } (details viene de las validaciones de Zod)
export interface ApiErrorBody {
    error?: string;
    details?: { field: string; message: string }[];
}
