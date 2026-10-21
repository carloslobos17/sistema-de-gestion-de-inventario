// src/features/categories/model/categories.constants.ts
// Valores fijos del módulo de categorías.
import type { CategoryFormValues, CategoryStatusTabOption } from './categories.types';

export const CATEGORY_STATUS_TABS: CategoryStatusTabOption[] = [
    { value: 'active', label: 'Activas' },
    { value: 'inactive', label: 'Inactivas' },
];

// Espera del buscador antes de consultar al backend (ms)
export const CATEGORY_SEARCH_DEBOUNCE_MS = 300;

// Mismas reglas que el backend (category.schema.ts)
export const CATEGORY_NAME_MIN_LENGTH = 2;
export const CATEGORY_NAME_MAX_LENGTH = 100;

export const EMPTY_CATEGORY_FORM: CategoryFormValues = {
    name: '',
};
