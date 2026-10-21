// =====================================================================
// H2 · Crear y editar una marca — Integrante 2
// Archivo: features/brands/hooks/useUpdateBrand.ts
// ---------------------------------------------------------------------
// QUÉ HACE: cambia el nombre de una marca y devuelve el resultado como ActionResult.
// Si el nombre no cambió, devuelve la marca original SIN llamar al backend.
// NO muestra toasts ni cierra modales: eso lo decide BrandFormModal.
// =====================================================================
import { useCallback, useState } from 'react';
import * as brandsApi from '../api/brands.service';
import { toUpdateBrandPayload } from '../model/brands.mappers';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { Brand, BrandActionResult, BrandFormValues } from '../model/brands.types';

export function useUpdateBrand() {
    const [isSaving, setIsSaving] = useState(false);

    const updateBrand = useCallback(async (original: Brand, values: BrandFormValues): Promise<BrandActionResult> => {
        const payload = toUpdateBrandPayload(values, original);

        // Nada cambió: no hace falta llamar al backend
        if (Object.keys(payload).length === 0) {
            return { ok: true, data: original };
        }

        setIsSaving(true);
        try {
            const updated = await brandsApi.updateBrand(original.id, payload);
            return { ok: true, data: updated };
        } catch (err) {
            return { ok: false, error: getErrorMessage(err, 'Error al actualizar la marca') };
        } finally {
            setIsSaving(false);
        }
    }, []);

    return { updateBrand, isSaving };
}
