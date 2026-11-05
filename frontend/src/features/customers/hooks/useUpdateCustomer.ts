// src/features/customers/hooks/useUpdateCustomer.ts
// 👤 DUEÑO: Persona 3
// Edita un cliente enviando SOLO lo que cambió. Si nada cambió, no llama al backend.
//
// TODO (Persona 3):
//   [ ] payload = toUpdateCustomerPayload(values, original, canEditCreditLimit) (ya existe en customers.mappers.ts).
//   [ ] Si el payload está vacío → { ok: true, data: original } sin llamar al backend.
//   [ ] Si no → customersApi.updateCustomer(original.id, payload), con isSaving.
//   [ ] Error → { ok: false, error: getErrorMessage(err, "Error al actualizar el cliente") }.
//   Referencia: src/features/suppliers/hooks/useUpdateSupplier.ts
import { useCallback } from 'react';
import type { Customer, CustomerActionResult, CustomerFormValues } from '../model/customers.types';

export function useUpdateCustomer() {
    const isSaving = false; // TODO: useState

    const updateCustomer = useCallback(
        async (_original: Customer, _values: CustomerFormValues, _canEditCreditLimit: boolean): Promise<CustomerActionResult> => {
            return { ok: false, error: 'Pendiente: editar cliente (useUpdateCustomer)' };
        },
        []
    );

    return { updateCustomer, isSaving };
}
