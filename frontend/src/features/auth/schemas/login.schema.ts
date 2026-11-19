// src/features/auth/schemas/login.schema.ts
// En el login solo se pide que vengan los datos (igual que el backend): el largo mínimo se valida al crear el usuario.
import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().trim().min(1, "El nombre de usuario es obligatorio"),
    password: z.string().min(1, "La contraseña es obligatoria"),
});
