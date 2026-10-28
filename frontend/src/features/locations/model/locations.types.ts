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

// ==========================================
// SELECTOR EN CASCADA (formularios)
// ==========================================

// Valor del selector mientras se llena el formulario ("" = sin elegir). Al guardar solo se envía district_id.
export interface LocationValue {
    department_code: string;
    municipality_id: string;
    district_id: string;
}

export interface LocationSelectProps {
    idPrefix: string;
    value: LocationValue;
    onChange: (value: LocationValue) => void;
    error?: string; // un solo mensaje para los tres selects (ej. "Seleccione el distrito")
    disabled?: boolean;
    required?: boolean;
}
