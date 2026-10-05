// src/modules/brands/brand.schema.ts
import { z } from 'zod';

// Nombre: sin espacios al inicio/final y con un solo espacio entre palabras ("  3M   Company " → "3M Company")
const brandNameSchema = z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar los 100 caracteres')
    .transform((value) => value.replace(/\s+/g, ' '));

export const createBrandSchema = z.object({
    name: brandNameSchema
});

// Edición parcial (PATCH): se puede cambiar el nombre, el estado o ambos
export const updateBrandSchema = z
    .object({
        name: brandNameSchema.optional(),
        is_active: z.boolean().optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: 'Debes enviar al menos un campo para actualizar'
    });

// :id de la URL (llega como texto)
export const brandIdParamSchema = z.object({
    id: z.coerce.number().int().positive('El ID de la marca no es válido')
});

// Filtros del listado (todo llega como texto en la URL)
export const brandFiltersSchema = z.object({
    search: z.string().trim().min(1).max(100).optional(),
    // OJO: z.coerce.boolean() convertiría "false" en true, por eso se hace así
    is_active: z
        .enum(['true', 'false'], { message: 'is_active debe ser "true" o "false"' })
        .transform((value) => value === 'true')
        .optional()
});

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
