// src/modules/brands/brand.types.ts

export interface Brand {
    id: number;
    name: string;
    is_active: boolean;
}

// Lo que se escribe en la BD al crear
export interface CreateBrandData {
    name: string;
}

// Lo que se escribe en la BD al editar (solo lo que cambia)
export type UpdateBrandData = Partial<CreateBrandData & { is_active: boolean }>;

// Filtros del listado: GET /api/brands?search=&is_active=
export interface BrandFilters {
    search?: string;
    is_active?: boolean;
}
