// src/features/customers/hooks/useCustomerStatus.ts
// 👤 DUEÑO: Persona 3
// Desactiva (borrado lógico) o reactiva un cliente. Devuelve ActionResult; NO muestra toasts.
//
// TODO (Persona 3):
//   [ ] Activo → customersApi.deactivateCustomer(id) · Inactivo → customersApi.updateCustomer(id, { is_active: true }).
//   [ ] isSaving con useState.
//   [ ] Error → { ok: false, error: getErrorMessage(err, "Error al desactivar/reactivar el cliente") }.
//   Referencia: src/features/suppliers/hooks/useSupplierStatus.ts
import { useCallback } from 'react';
import type { ActionResult } from '../../../types/common';
import type { Customer } from '../model/customers.types';

export function useCustomerStatus() {
    const isSaving = false; // TODO: useState

    const toggleCustomerStatus = useCallback(async (_customer: Customer): Promise<ActionResult<Customer | void>> => {
        return { ok: false, error: 'Pendiente: desactivar/reactivar (useCustomerStatus)' };
    }, []);

    return { toggleCustomerStatus, isSaving };
}
