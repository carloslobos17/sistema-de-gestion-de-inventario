// src/modules/categories/category.types.ts

export interface Category {
    id: number;
    name: string;
    is_active: boolean;
}

// Opción para los selects (GET /api/categories/options): solo lo necesario
export interface CategoryOption {
    id: number;
    name: string;
}

// Lo que se escribe en la BD al crear
export interface CreateCategoryData {
    name: string;
}

// Lo que se escribe en la BD al editar (solo lo que cambia)
export type UpdateCategoryData = Partial<CreateCategoryData & { is_active: boolean }>;

// Filtros del listado: GET /api/categories?search=&is_active=
export interface CategoryFilters {
    search?: string;
    is_active?: boolean;
}
