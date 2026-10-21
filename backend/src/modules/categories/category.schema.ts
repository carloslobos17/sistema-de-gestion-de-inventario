// src/modules/categories/category.schema.ts
import { z } from 'zod';
import { paginationQuerySchema } from '../../utils/pagination';

// Nombre: sin espacios al inicio/final y con un solo espacio entre palabras ("  Herramientas   eléctricas " → "Herramientas eléctricas")
const categoryNameSchema = z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar los 100 caracteres')
    .transform((value) => value.replace(/\s+/g, ' '));

export const createCategorySchema = z.object({
    name: categoryNameSchema
});

// Edición parcial (PATCH): se puede cambiar el nombre, el estado o ambos
export const updateCategorySchema = z
    .object({
        name: categoryNameSchema.optional(),
        is_active: z.boolean().optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: 'Debes enviar al menos un campo para actualizar'
    });

// :id de la URL (llega como texto)
export const categoryIdParamSchema = z.object({
    id: z.coerce.number().int().positive('El ID de la categoría no es válido')
});

// Filtros + paginación del listado: ?search=&is_active=&page=&limit= (todo llega como texto)
export const categoryFiltersSchema = z.object({
    // search vacío ("") se trata como si no se hubiera enviado
    search: z.string().trim().max(100).optional().transform((value) => value || undefined),
    // OJO: z.coerce.boolean() convertiría "false" en true, por eso se hace así
    is_active: z
        .enum(['true', 'false'], { message: 'is_active debe ser "true" o "false"' })
        .transform((value) => value === 'true')
        .optional(),
    ...paginationQuerySchema.shape
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
