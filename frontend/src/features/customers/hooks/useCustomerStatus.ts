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
                return {
                    ok: false,
                    error: getErrorMessage(err, 'Error al desactivar/reactivar el cliente')
                };
            } finally {
                setIsSaving(false);
            }
        },
        []
    );

    return { toggleCustomerStatus, isSaving };
}