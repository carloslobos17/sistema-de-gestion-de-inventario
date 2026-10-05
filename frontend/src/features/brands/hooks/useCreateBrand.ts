// =====================================================================
// H2 · Crear y editar una marca — Integrante 2
// Archivo: features/brands/hooks/useCreateBrand.ts
// ---------------------------------------------------------------------
// QUÉ HACE: crea una marca y devuelve el resultado como ActionResult.
//
// TAREAS:
//   [ ] Estado isSaving (true mientras espera al backend, false en finally)
//   [ ] Llamar brandsApi.createBrand(toCreateBrandPayload(values))
//   [ ] Éxito → { ok: true, data: marcaCreada }
//   [ ] Error → { ok: false, error: getErrorMessage(err, 'Error al crear la marca') }
//   [ ] Este hook NO muestra toasts ni cierra modales: eso lo decide BrandFormModal
//
// REFERENCIA: features/users/hooks/useCreateUser.ts (es casi idéntico)
// =====================================================================
import { useCallback } from 'react';
import type { BrandActionResult, BrandFormValues } from '../model/brands.types';

export function useCreateBrand() {
    const isSaving = false; // TODO H2: convertir en estado

    const createBrand = useCallback(async (values: BrandFormValues): Promise<BrandActionResult> => {
        // TODO H2: implementar (ver TAREAS arriba)
        return { ok: false, error: `Crear marca "${values.name}": pendiente (H2)` };
    }, []);

    return { createBrand, isSaving };
}
