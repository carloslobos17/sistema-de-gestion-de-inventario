// src/features/brands/model/brands.mappers.ts
// [H0 · BASE] Funciones puras: convierten datos de una forma a otra (sin estado ni peticiones).
import type { Brand, BrandFilters, BrandFormValues, CreateBrandPayload, UpdateBrandPayload } from './brands.types';

// "  3M    Company " → "3M Company" (igual que hace el backend)
export function normalizeBrandName(name: string): string {
    return name.trim().replace(/\s+/g, ' ');
}

// Filtros → query string de GET /api/brands (omite los vacíos)
export function toBrandQueryParams(filters: BrandFilters): Record<string, string> {
    const params: Record<string, string> = {};

    if (filters.search?.trim()) params.search = filters.search.trim();
    if (filters.is_active !== undefined) params.is_active = String(filters.is_active);

    return params;
}

// Marca del backend → valores iniciales del formulario (modo editar)
export function toBrandFormValues(brand: Brand): BrandFormValues {
    return { name: brand.name };
}

// Formulario → body de POST /api/brands
export function toCreateBrandPayload(values: BrandFormValues): CreateBrandPayload {
    return { name: normalizeBrandName(values.name) };
}

// Formulario → body de PATCH /api/brands/:id (solo si el nombre cambió)
export function toUpdateBrandPayload(values: BrandFormValues, original: Brand): UpdateBrandPayload {
    const name = normalizeBrandName(values.name);
    return name !== original.name ? { name } : {};
}
