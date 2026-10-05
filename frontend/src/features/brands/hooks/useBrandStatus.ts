// =====================================================================
// H3 · Desactivar y reactivar una marca — Integrante 3
// Archivo: features/brands/hooks/useBrandStatus.ts
// ---------------------------------------------------------------------
// QUÉ HACE: desactiva (borrado lógico) o reactiva una marca.
//
// TAREAS:
//   [ ] Estado isSaving
//   [ ] Marca activa   → brandsApi.deactivateBrand(brand.id)            (DELETE /api/brands/:id)
//       Marca inactiva → brandsApi.updateBrand(brand.id, { is_active: true }) (PATCH)
//   [ ] Devolver ActionResult: { ok: true, data } o { ok: false, error: getErrorMessage(...) }
//   [ ] Este hook NO muestra toasts ni abre modales: eso lo decide BrandStatusButton
//
// REFERENCIA: features/users/hooks/useUserStatus.ts (toggleUserStatus es lo mismo)
// =====================================================================
import { useCallback } from 'react';
import type { ActionResult } from '../../../types/common';
import type { Brand } from '../model/brands.types';

export function useBrandStatus() {
    const isSaving = false; // TODO H3: convertir en estado

    const toggleBrandStatus = useCallback(async (brand: Brand): Promise<ActionResult<Brand | void>> => {
        // TODO H3: implementar (ver TAREAS arriba)
        return { ok: false, error: `Cambiar estado de "${brand.name}": pendiente (H3)` };
    }, []);

    return { toggleBrandStatus, isSaving };
}
