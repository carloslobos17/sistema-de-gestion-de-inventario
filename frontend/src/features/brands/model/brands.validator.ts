// =====================================================================
// H2 · Crear y editar una marca — Integrante 2
// Archivo: features/brands/model/brands.validator.ts
// ---------------------------------------------------------------------
// QUÉ HACE: reglas de validación del formulario de marca (Zod), iguales al backend
// (backend/src/modules/brands/brand.schema.ts).
// La limpieza de espacios internos ("3M    Company" → "3M Company") la hace el mapper
// toCreateBrandPayload / toUpdateBrandPayload al enviar.
// =====================================================================
import { z } from 'zod';
import { BRAND_NAME_MAX_LENGTH, BRAND_NAME_MIN_LENGTH } from './brands.constants';

export const brandFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(BRAND_NAME_MIN_LENGTH, `El nombre debe tener al menos ${BRAND_NAME_MIN_LENGTH} caracteres`)
        .max(BRAND_NAME_MAX_LENGTH, `El nombre no puede superar los ${BRAND_NAME_MAX_LENGTH} caracteres`),
});
