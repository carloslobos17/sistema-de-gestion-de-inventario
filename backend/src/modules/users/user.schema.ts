import { z } from 'zod';

export const createUserSchema = z.object({
    role_id: z.number().int().positive('El rol es obligatorio'),
    username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres').max(100),
    first_name: z.string().min(1, 'El nombre es obligatorio').max(100),
    last_name: z.string().min(1, 'El apellido es obligatorio').max(100),
    password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres')
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
