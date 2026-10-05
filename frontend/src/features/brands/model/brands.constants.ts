// src/features/brands/model/brands.constants.ts
// [H0 · BASE] Valores fijos del módulo de marcas.
import type { BrandFormValues, BrandStatusTabOption } from './brands.types';

export const BRAND_STATUS_TABS: BrandStatusTabOption[] = [
    { value: 'active', label: 'Activas' },
    { value: 'inactive', label: 'Inactivas' },
];

// Espera del buscador antes de consultar al backend (ms)
export const BRAND_SEARCH_DEBOUNCE_MS = 300;

// Mismas reglas que el backend (brand.schema.ts)
export const BRAND_NAME_MIN_LENGTH = 2;
export const BRAND_NAME_MAX_LENGTH = 100;

export const EMPTY_BRAND_FORM: BrandFormValues = {
    name: '',
};
