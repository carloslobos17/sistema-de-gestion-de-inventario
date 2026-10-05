import { z } from 'zod';

// Expresión regular: solo letras (incluye tildes, diéresis y eñes) y espacios
const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

// Expresión regular: solo minúsculas, números, puntos, guiones medios y bajos
const USERNAME_REGEX = /^[a-z0-9_.-]+$/;

// Creación de usuario (POST /api/users)
export const createUserSchema = z.object({
    role_id: z
        .number({ message: 'El rol debe ser un número' })
        .int('El rol debe ser un número entero')
        .positive('El rol es obligatorio'),
    username: z
        .string()
        .trim()
        .toLowerCase()
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
        .max(30, 'El nombre de usuario no puede superar los 30 caracteres')
        .regex(USERNAME_REGEX, 'El usuario solo puede contener letras minúsculas, números, guiones y puntos'),
    first_name: z
        .string()
        .trim()
        .min(1, 'El nombre es obligatorio')
        .max(50, 'El nombre no puede superar los 50 caracteres')
        .regex(NAME_REGEX, 'El nombre solo puede contener letras y espacios'),
    last_name: z
        .string()
        .trim()
        .min(1, 'El apellido es obligatorio')
        .max(50, 'El apellido no puede superar los 50 caracteres')
        .regex(NAME_REGEX, 'El apellido solo puede contener letras y espacios'),
    password: z
        .string()
        .min(4, 'La contraseña debe tener al menos 4 caracteres')
        .max(100, 'La contraseña es demasiado larga')
});

// Edición parcial (PATCH /api/users/:id)
export const updateUserSchema = z
    .object({
        role_id: z
            .number({ message: 'El rol debe ser un número' })
            .int('El rol debe ser un número entero')
            .positive('El rol no es válido')
            .optional(),
        username: z
            .string()
            .trim()
            .toLowerCase()
            .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
            .max(30, 'El nombre de usuario no puede superar los 30 caracteres')
            .regex(USERNAME_REGEX, 'El usuario solo puede contener letras minúsculas, números, guiones y puntos')
            .optional(),
        first_name: z
            .string()
            .trim()
            .min(1, 'El nombre no puede estar vacío')
            .max(50, 'El nombre no puede superar los 50 caracteres')
            .regex(NAME_REGEX, 'El nombre solo puede contener letras y espacios')
            .optional(),
        last_name: z
            .string()
            .trim()
            .min(1, 'El apellido no puede estar vacío')
            .max(50, 'El apellido no puede superar los 50 caracteres')
            .regex(NAME_REGEX, 'El apellido solo puede contener letras y espacios')
            .optional(),
        password: z
            .string()
            .min(4, 'La contraseña debe tener al menos 4 caracteres')
            .max(100, 'La contraseña es demasiado larga')
            .optional(),
        is_active: z.boolean({ message: 'is_active debe ser un booleano' }).optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: 'Debes enviar al menos un campo para actualizar'
    });

// Valida el :id de la URL (GET /api/users/:id, PATCH /api/users/:id, DELETE /api/users/:id)
export const userIdParamSchema = z.object({
    id: z.coerce.number().int('El ID debe ser entero').positive('El ID de usuario no es válido')
});

// Filtros del listado (GET /api/users?search=ana&role_id=2&is_active=false)
export const userFiltersSchema = z.object({
    search: z.string().trim().min(1).max(100).optional(),
    role_id: z.coerce.number().int().positive('El rol no es válido').optional(),
    is_active: z
        .enum(['true', 'false'], { message: 'is_active debe ser "true" o "false"' })
        .transform((value) => value === 'true')
        .optional()
});

// Tipos TypeScript inferidos
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
export type UserFilters = z.infer<typeof userFiltersSchema>;