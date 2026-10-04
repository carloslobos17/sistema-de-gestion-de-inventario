import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string().min(1, 'El nombre de usuario es obligatorio'),
    password: z.string().min(4, 'La contraseña es obligatoria')
});

// Puedes exportar el tipo inferido si lo necesitas en el controlador
export type LoginInput = z.infer<typeof loginSchema>;