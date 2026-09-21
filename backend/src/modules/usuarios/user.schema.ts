import { z } from 'zod';

export const crearUsuarioSchema = z.object({
    rol_id: z.number().int().positive('El rol es obligatorio'),
    nombre_usuario: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres').max(100),
    nombre: z.string().min(1, 'El nombre es obligatorio').max(100),
    apellido: z.string().min(1, 'El apellido es obligatorio').max(100),
    password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres')
});

export type CrearUsuarioInput = z.infer<typeof crearUsuarioSchema>;
