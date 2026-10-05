import { z } from 'zod';

const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
const USERNAME_REGEX = /^[a-z0-9_.-]+$/;

export const userFormSchema = (isEdit: boolean) =>
    z.object({
        first_name: z
            .string()
            .trim()
            .min(1, 'El nombre es obligatorio')
            .regex(NAME_REGEX, 'El nombre solo puede contener letras'),
        last_name: z
            .string()
            .trim()
            .min(1, 'El apellido es obligatorio')
            .regex(NAME_REGEX, 'El apellido solo puede contener letras'),
        username: z
            .string()
            .trim()
            .min(3, 'Mínimo 3 caracteres')
            .regex(USERNAME_REGEX, 'Solo minúsculas, números, puntos o guiones bajos'),
        role_id: z.number().positive('Selecciona un rol válido'),
        password: isEdit
            ? z.string().optional().refine((val) => !val || val.length >= 4, {
                message: 'La nueva contraseña debe tener al menos 4 caracteres',
            })
            : z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),
        is_active: z.boolean(),
    });

export type FormErrors = Partial<Record<string, string>>;