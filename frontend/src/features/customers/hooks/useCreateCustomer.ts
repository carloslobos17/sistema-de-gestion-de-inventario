// src/features/customers/hooks/useCreateCustomer.ts
// Crea un cliente. Devuelve ActionResult; NO muestra toasts ni navega (eso lo hace la página).
// El mapper ya omite credit_limit cuando el usuario no puede editarlo (vendedor), así no recibe un 403.
import { useCallback, useState } from 'react';
import * as customersApi from '../api/customers.service';
import { toCreateCustomerPayload } from '../model/customers.mappers';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { CustomerActionResult, CustomerFormValues } from '../model/customers.types';

export function useCreateCustomer() {
    const [isSaving, setIsSaving] = useState(false);

    const createCustomer = useCallback(
        async (values: CustomerFormValues, canEditCreditLimit: boolean): Promise<CustomerActionResult> => {
            setIsSaving(true);
            try {
                const created = await customersApi.createCustomer(toCreateCustomerPayload(values, canEditCreditLimit));
                return { ok: true, data: created };
            } catch (err) {
                // 409 (documento o NRC repetido) y 403 (sin permiso) traen el mensaje del backend
                return { ok: false, error: getErrorMessage(err, 'Error al crear el cliente') };
            } finally {
                setIsSaving(false);
            }
        },
        []
    );

    return { createCustomer, isSaving };
}
