// =====================================================================
// H2 · Crear y editar una marca — Integrante 2
// Archivo: features/brands/hooks/useUpdateBrand.ts
// ---------------------------------------------------------------------
// QUÉ HACE: cambia el nombre de una marca y devuelve el resultado como ActionResult.
//
// TAREAS:
//   [ ] Armar el payload con toUpdateBrandPayload(values, original)
//   [ ] Si el payload está vacío (no cambió el nombre) → devolver { ok: true, data: original }
//       SIN llamar al backend
//   [ ] Estado isSaving
//   [ ] Llamar brandsApi.updateBrand(original.id, payload)
//   [ ] Éxito / error igual que useCreateBrand
//
// REFERENCIA: features/users/hooks/useUpdateUser.ts (es casi idéntico)
// =====================================================================
import { useCallback } from 'react';
import type { Brand, BrandActionResult, BrandFormValues } from '../model/brands.types';

export function useUpdateBrand() {
    const isSaving = false; // TODO H2: convertir en estado

    const updateBrand = useCallback(async (original: Brand, values: BrandFormValues): Promise<BrandActionResult> => {
        // TODO H2: implementar (ver TAREAS arriba)
        return { ok: false, error: `Editar "${original.name}" → "${values.name}": pendiente (H2)` };
    }, []);

    return { updateBrand, isSaving };
}
