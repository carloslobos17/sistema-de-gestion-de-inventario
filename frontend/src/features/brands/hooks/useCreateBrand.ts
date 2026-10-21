// =====================================================================
// H2 · Crear y editar una marca — Integrante 2
// Archivo: features/brands/hooks/useCreateBrand.ts
// ---------------------------------------------------------------------
// QUÉ HACE: crea una marca y devuelve el resultado como ActionResult.
// NO muestra toasts ni cierra modales: eso lo decide BrandFormModal.
// =====================================================================
import { useCallback, useState } from 'react';
import * as brandsApi from '../api/brands.service';
import { toCreateBrandPayload } from '../model/brands.mappers';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { BrandActionResult, BrandFormValues } from '../model/brands.types';

export function useCreateBrand() {
    const [isSaving, setIsSaving] = useState(false);

    const createBrand = useCallback(async (values: BrandFormValues): Promise<BrandActionResult> => {
        setIsSaving(true);
        try {
            // El mapper limpia los espacios: "  3M    Company " → "3M Company"
            const created = await brandsApi.createBrand(toCreateBrandPayload(values));
            return { ok: true, data: created };
        } catch (err) {
            // 409 (nombre repetido) y 403 (sin permiso) traen el mensaje del backend
            return { ok: false, error: getErrorMessage(err, 'Error al crear la marca') };
        } finally {
            setIsSaving(false);
        }
    }, []);

    return { createBrand, isSaving };
}
