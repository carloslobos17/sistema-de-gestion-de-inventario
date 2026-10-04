import { z } from 'zod';

export const createUserSchema = z.object({
    role_id: z.number().int().positive('El rol es obligatorio'),
    username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres').max(100),
    first_name: z.string().min(1, 'El nombre es obligatorio').max(100),
    last_name: z.string().min(1, 'El apellido es obligatorio').max(100),
    password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres')
});

// Edición parcial (PATCH): todos los campos son opcionales, pero debe venir al menos uno.
// La contraseña solo se cambia si se envía.
export const updateUserSchema = z
    .object({
        role_id: z.number().int().positive('El rol no es válido').optional(),
        username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres').max(100).optional(),
        first_name: z.string().min(1, 'El nombre no puede estar vacío').max(100).optional(),
        last_name: z.string().min(1, 'El apellido no puede estar vacío').max(100).optional(),
        password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres').optional(),
        is_active: z.boolean().optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: 'Debes enviar al menos un campo para actualizar'
    });

// Valida el :id de la URL (llega como string, se convierte a número)
export const userIdParamSchema = z.object({
    id: z.coerce.number().int().positive('El ID de usuario no es válido')
});

// Filtros del listado: GET /api/users?search=ana&role_id=2&is_active=false
export const userFiltersSchema = z.object({
    search: z.string().trim().min(1).max(100).optional(),
    role_id: z.coerce.number().int().positive('El rol no es válido').optional(),
    is_active: z
        .enum(['true', 'false'], { message: 'is_active debe ser "true" o "false"' })
        .transform((value) => value === 'true')
        .optional()
});



export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;