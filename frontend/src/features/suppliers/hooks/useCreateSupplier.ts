// src/features/suppliers/hooks/useCreateSupplier.ts
// Crea un proveedor. Devuelve ActionResult; NO muestra toasts ni navega.
import { useCallback, useState } from 'react';
import * as suppliersApi from '../api/suppliers.service';
import { toCreateSupplierPayload } from '../model/suppliers.mappers';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { SupplierActionResult, SupplierFormValues } from '../model/suppliers.types';

export function useCreateSupplier() {
    const [isSaving, setIsSaving] = useState(false);

    const createSupplier = useCallback(async (values: SupplierFormValues): Promise<SupplierActionResult> => {
        setIsSaving(true);
        try {
            const created = await suppliersApi.createSupplier(toCreateSupplierPayload(values));
            return { ok: true, data: created };
        } catch (err) {
            // 409 (dato repetido) y 403 (sin permiso) traen el mensaje del backend
            return { ok: false, error: getErrorMessage(err, 'Error al crear el proveedor') };
        } finally {
            setIsSaving(false);
        }
    }, []);

    return { createSupplier, isSaving };
}
