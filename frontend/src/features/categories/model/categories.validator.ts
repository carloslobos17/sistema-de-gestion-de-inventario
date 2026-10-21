// src/features/categories/model/categories.validator.ts
// Reglas de validación del formulario de categoría (Zod). Iguales a las del backend.
import { z } from 'zod';
import { CATEGORY_NAME_MAX_LENGTH, CATEGORY_NAME_MIN_LENGTH } from './categories.constants';

export const categoryFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(CATEGORY_NAME_MIN_LENGTH, `El nombre debe tener al menos ${CATEGORY_NAME_MIN_LENGTH} caracteres`)
        .max(CATEGORY_NAME_MAX_LENGTH, `El nombre no puede superar los ${CATEGORY_NAME_MAX_LENGTH} caracteres`),
});
