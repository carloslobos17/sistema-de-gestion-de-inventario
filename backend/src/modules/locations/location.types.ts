// src/modules/locations/location.types.ts
// Árbol departamento → municipio → distrito (catálogos de Hacienda). Solo lectura.

export interface DistrictNode {
    id: number;
    code: string;
    name: string;
}

export interface MunicipalityNode {
    id: number;
    code: string;
    name: string;
    districts: DistrictNode[];
}

export interface DepartmentNode {
    code: string;
    name: string;
    municipalities: MunicipalityNode[];
}
