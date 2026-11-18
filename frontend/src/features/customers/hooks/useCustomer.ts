// src/features/customers/hooks/useCustomer.ts
// Carga un cliente por su ID para precargar el formulario de edición.
import { useEffect, useState } from 'react';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import * as customersApi from '../api/customers.service';
import type { Customer } from '../model/customers.types';

export function useCustomer(id: number) {
    const isValidId = Number.isInteger(id) && id > 0;

    const [customer, setCustomer] = useState<Customer | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(isValidId);
    const [error, setError] = useState<string | null>(
        isValidId ? null : 'El ID del cliente no es válido.'
    );

    useEffect(() => {
        if (!isValidId) {
            setCustomer(null);
            setIsLoading(false);
            setError('El ID del cliente no es válido.');
            return;
        }

        let cancelled = false;
        setIsLoading(true);
        setError(null);

        customersApi
            .fetchCustomerById(id)
            .then((data) => {
                if (!cancelled) {
                    setCustomer(data);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setCustomer(null);
                    setError(getErrorMessage(err, 'No se pudo cargar el cliente'));
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setIsLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [id, isValidId]);

    return { customer, isLoading, error };
}