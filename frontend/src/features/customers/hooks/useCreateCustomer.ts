// src/features/customers/hooks/useCreateCustomer.ts
// 👤 DUEÑO: Persona 1
// Crea un cliente. Devuelve ActionResult; NO muestra toasts ni navega (eso lo hace la página).
//
// TODO (Persona 1):
//   [ ] isSaving con useState (true mientras se envía).
//   [ ] Llamar a customersApi.createCustomer(toCreateCustomerPayload(values, canEditCreditLimit)).
//   [ ] Éxito → { ok: true, data: cliente }. Error → { ok: false, error: getErrorMessage(err, "Error al crear el cliente") }
//       (el 409 de documento/NRC repetido ya trae su mensaje del backend).
//   Referencia: src/features/suppliers/hooks/useCreateSupplier.ts
import { useCallback } from 'react';
import type { CustomerActionResult, CustomerFormValues } from '../model/customers.types';

export function useCreateCustomer() {
    const isSaving = false; // TODO: useState

    const createCustomer = useCallback(
        async (_values: CustomerFormValues, _canEditCreditLimit: boolean): Promise<CustomerActionResult> => {
            return { ok: false, error: 'Pendiente: crear cliente (useCreateCustomer)' };
        },
        []
    );

    return { createCustomer, isSaving };
}
