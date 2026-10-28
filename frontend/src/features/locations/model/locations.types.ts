// src/features/locations/model/locations.types.ts
// Catálogos geográficos de Hacienda (departamento → municipio → distrito). Solo lectura.

export interface District {
    id: number;
    code: string;
    name: string;
}

export interface Municipality {
    id: number;
    code: string;
    name: string;
    districts: District[];
}

export interface Department {
    code: string;
    name: string;
    municipalities: Municipality[];
}
