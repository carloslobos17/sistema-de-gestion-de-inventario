// src/features/suppliers/hooks/useSupplierStatus.ts
// Desactiva (borrado lógico) o reactiva un proveedor. Devuelve ActionResult; NO muestra toasts.
import { useCallback, useState } from 'react';
import * as suppliersApi from '../api/suppliers.service';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { ActionResult } from '../../../types/common';
import type { Supplier } from '../model/suppliers.types';

export function useSupplierStatus() {
    const [isSaving, setIsSaving] = useState(false);

    // Activa → DELETE /api/suppliers/:id · Inactiva → PATCH { is_active: true }
    const toggleSupplierStatus = useCallback(async (supplier: Supplier): Promise<ActionResult<Supplier | void>> => {
        setIsSaving(true);
        try {
            const data = supplier.is_active
                ? await suppliersApi.deactivateSupplier(supplier.id)
                : await suppliersApi.updateSupplier(supplier.id, { is_active: true });
            return { ok: true, data };
        } catch (err) {
            const fallback = supplier.is_active
                ? 'Error al desactivar el proveedor'
                : 'Error al reactivar el proveedor';
            return { ok: false, error: getErrorMessage(err, fallback) };
        } finally {
            setIsSaving(false);
        }
    }, []);

    return { toggleSupplierStatus, isSaving };
}
