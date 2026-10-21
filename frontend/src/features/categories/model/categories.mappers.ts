// src/features/categories/model/categories.mappers.ts
// Funciones puras: convierten datos de una forma a otra (sin estado ni peticiones).
import type { Category, CategoryFilters, CategoryFormValues, CreateCategoryPayload, UpdateCategoryPayload } from './categories.types';

// "  Herramientas   eléctricas " → "Herramientas eléctricas" (igual que hace el backend)
export function normalizeCategoryName(name: string): string {
    return name.trim().replace(/\s+/g, ' ');
}

// Filtros → query string de GET /api/categories (omite los vacíos)
export function toCategoryQueryParams(filters: CategoryFilters): Record<string, string> {
    const params: Record<string, string> = {};

    if (filters.search?.trim()) params.search = filters.search.trim();
    if (filters.is_active !== undefined) params.is_active = String(filters.is_active);

    return params;
}

// Categoría del backend → valores iniciales del formulario (modo editar)
export function toCategoryFormValues(category: Category): CategoryFormValues {
    return { name: category.name };
}

// Formulario → body de POST /api/categories
export function toCreateCategoryPayload(values: CategoryFormValues): CreateCategoryPayload {
    return { name: normalizeCategoryName(values.name) };
}

// Formulario → body de PATCH /api/categories/:id (solo si el nombre cambió)
export function toUpdateCategoryPayload(values: CategoryFormValues, original: Category): UpdateCategoryPayload {
    const name = normalizeCategoryName(values.name);
    return name !== original.name ? { name } : {};
}
