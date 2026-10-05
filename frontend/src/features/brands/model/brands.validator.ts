// =====================================================================
// H2 · Crear y editar una marca — Integrante 2
// Archivo: features/brands/model/brands.validator.ts
// ---------------------------------------------------------------------
// QUÉ HACE: reglas de validación del formulario de marca (Zod), iguales al backend.
//
// TAREAS:
//   [ ] name: .trim()
//   [ ] mínimo BRAND_NAME_MIN_LENGTH (2): "El nombre debe tener al menos 2 caracteres"
//   [ ] máximo BRAND_NAME_MAX_LENGTH (100): "El nombre no puede superar los 100 caracteres"
//   [ ] Usar las constantes de model/brands.constants.ts, no escribir 2 y 100 a mano
//
// REFERENCIA: features/users/model/users.validator.ts
// =====================================================================
import { z } from 'zod';

// TODO H2: agregar las reglas (ver TAREAS arriba)
export const brandFormSchema = z.object({
    name: z.string(),
});
