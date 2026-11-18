// src/features/customers/hooks/useCustomerStatus.ts
// Desactiva (borrado lógico) o reactiva un cliente. Devuelve ActionResult; NO muestra toasts.
import { useCallback, useState } from 'react';
import type { ActionResult } from '../../../types/common';
import type { Customer } from '../model/customers.types';
import { deactivateCustomer, updateCustomer } from '../api/customers.service';
import { getErrorMessage } from '../../../utils/getErrorMessage';

export function useCustomerStatus() {
    const [isSaving, setIsSaving] = useState(false);

    const toggleCustomerStatus = useCallback(
        async (customer: Customer): Promise<ActionResult<Customer | void>> => {
            setIsSaving(true);
            try {
                if (customer.is_active) {
                    await deactivateCustomer(customer.id);
                    return { ok: true, data: undefined };
                } else {
                    const updatedCustomer = await updateCustomer(customer.id, { is_active: true });
                    return { ok: true, data: updatedCustomer };
                }
            } catch (err) {
                const fallback = customer.is_active
                    ? 'Error al desactivar el cliente'
                    : 'Error al reactivar el cliente';
                return {
                    ok: false,
                    error: getErrorMessage(err, fallback)
                };
            } finally {
                setIsSaving(false);
            }
        },
        []
    );

    return { toggleCustomerStatus, isSaving };
}