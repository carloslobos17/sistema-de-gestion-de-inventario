// src/features/suppliers/hooks/useUpdateSupplier.ts
// Edita un proveedor enviando solo lo que cambió. Si nada cambió, no llama al backend.
import { useCallback, useState } from 'react';
import * as suppliersApi from '../api/suppliers.service';
import { toUpdateSupplierPayload } from '../model/suppliers.mappers';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { Supplier, SupplierActionResult, SupplierFormValues } from '../model/suppliers.types';

export function useUpdateSupplier() {
    const [isSaving, setIsSaving] = useState(false);

    const updateSupplier = useCallback(
        async (original: Supplier, values: SupplierFormValues): Promise<SupplierActionResult> => {
            const payload = toUpdateSupplierPayload(values, original);

            // Nada cambió: no hace falta llamar al backend
            if (Object.keys(payload).length === 0) {
                return { ok: true, data: original };
            }

            setIsSaving(true);
            try {
                const updated = await suppliersApi.updateSupplier(original.id, payload);
                return { ok: true, data: updated };
            } catch (err) {
                return { ok: false, error: getErrorMessage(err, 'Error al actualizar el proveedor') };
            } finally {
                setIsSaving(false);
            }
        },
        []
    );

    return { updateSupplier, isSaving };
}
