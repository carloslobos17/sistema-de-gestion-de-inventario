// src/modules/auth/auth.schema.ts
import { z } from 'zod';

// En el login solo se pide que vengan los datos: el largo mínimo de la contraseña se valida al CREAR el usuario.
export const loginSchema = z.object({
    username: z.string().trim().min(1, 'El nombre de usuario es obligatorio'),
    password: z.string().min(1, 'La contraseña es obligatoria')
});

export type LoginInput = z.infer<typeof loginSchema>;
