// =====================================================================
// H2 · Crear y editar una marca — Integrante 2
// Archivo: features/brands/hooks/useBrandForm.ts
// ---------------------------------------------------------------------
// QUÉ HACE: estado del formulario de marca (lo que se escribe) y su validación.
//
// TAREAS:
//   [ ] handleChange(e) para el <Input name="name">
//   [ ] Estado errors: BrandFormErrors
//   [ ] validate(): valida values con brandFormSchema (model/brands.validator.ts) usando
//       safeParse; si falla, llena errors por campo y devuelve false; si pasa, limpia y devuelve true
//   [ ] Al escribir en un campo con error, borrar ese error
//   [ ] Devolver { values, errors, handleChange, validate }
//
// REFERENCIA: features/users/hooks/useUserForm.ts y la validación de UserForm.tsx
// =====================================================================
import { useState } from 'react';
import { EMPTY_BRAND_FORM } from '../model/brands.constants';
import type { BrandFormValues } from '../model/brands.types';

export function useBrandForm(initialValues: BrandFormValues = EMPTY_BRAND_FORM) {
    const [values, setValues] = useState<BrandFormValues>(initialValues);

    // TODO H2: errors, handleChange y validate (ver TAREAS arriba)

    return { values, setValues };
}
