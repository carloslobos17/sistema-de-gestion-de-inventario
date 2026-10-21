// src/types/pagination.types.ts
// Tipos de la paginación. Los comparten todos los listados (usuarios, marcas, categorías...).

// Lo que pide el cliente: ?page=2&limit=10
export interface PaginationParams {
    page: number;
    limit: number;
}

// Lo que se devuelve junto a los datos para dibujar el paginador
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// Respuesta de un listado paginado: { data, meta }
export interface PaginatedResult<T> {
    data: T[];
    meta: PaginationMeta;
}
