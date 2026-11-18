// src/features/customers/hooks/useUpdateCustomer.ts
// Edita un cliente enviando solo los campos que cambiaron. Si nada cambió, no llama al backend.
import { useCallback, useState } from 'react';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import * as customersApi from '../api/customers.service';
import { toUpdateCustomerPayload } from '../model/customers.mappers';
import type { Customer, CustomerActionResult, CustomerFormValues } from '../model/customers.types';

export function useUpdateCustomer() {
    const [isSaving, setIsSaving] = useState(false);

    const updateCustomer = useCallback(
        async (
            original: Customer,
            values: CustomerFormValues,
            canEditCreditLimit: boolean
        ): Promise<CustomerActionResult> => {
            const payload = toUpdateCustomerPayload(values, original, canEditCreditLimit);
            const hasChanges = Object.values(payload).some((value) => value !== undefined);

            if (!hasChanges) {
                return { ok: true, data: original };
            }

            setIsSaving(true);
            try {
                const updated = await customersApi.updateCustomer(original.id, payload);
                return { ok: true, data: updated };
            } catch (err) {
                return {
                    ok: false,
                    error: getErrorMessage(err, 'Error al actualizar el cliente'),
                };
            } finally {
                setIsSaving(false);
            }
        },
        []
    );

    return { updateCustomer, isSaving };
}