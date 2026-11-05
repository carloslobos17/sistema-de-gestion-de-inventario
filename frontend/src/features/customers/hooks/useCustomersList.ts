// src/features/customers/hooks/useCustomersList.ts
// Carga una página de clientes y la recarga cuando cambian los filtros o la página.
import { useCallback, useEffect, useRef, useState } from 'react';
import * as customersApi from '../api/customers.service';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { PaginationMeta } from '../../../types/common';
import type { Customer, CustomerFilters } from '../model/customers.types';

// onPageOutOfRange: se llama con la última página válida cuando la actual quedó vacía
// (ej. se desactivó el único cliente de la página 3 → hay que ir a la 2)
export function useCustomersList(filters: CustomerFilters, onPageOutOfRange?: (lastPage: number) => void) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Evita que una respuesta vieja pise a una nueva (ej. al escribir rápido en el buscador)
    const requestIdRef = useRef(0);

    // Campos sueltos como dependencias: no recarga si solo cambia la referencia del objeto
    const { search, is_active, customer_type, page } = filters;

    const loadCustomers = useCallback(async () => {
        const requestId = ++requestIdRef.current;
        const isLatest = () => requestId === requestIdRef.current;

        setIsLoading(true);
        setError(null);
        try {
            const result = await customersApi.fetchCustomers({ search, is_active, customer_type, page });
            if (isLatest()) {
                setCustomers(result.data);
                setMeta(result.meta);
            }
        } catch (err) {
            if (isLatest()) setError(getErrorMessage(err, 'Error al cargar los clientes'));
        } finally {
            if (isLatest()) setIsLoading(false);
        }
    }, [search, is_active, customer_type, page]);

    useEffect(() => {
        loadCustomers();
    }, [loadCustomers]);

    // La página pedida ya no existe (quedó vacía) → ir a la última que sí tiene datos
    useEffect(() => {
        if (!meta || !onPageOutOfRange) return;
        const lastPage = Math.max(meta.totalPages, 1);
        if (meta.page > lastPage) onPageOutOfRange(lastPage);
    }, [meta, onPageOutOfRange]);

    // Quita un cliente de la tabla al instante (después se recarga para rellenar la página)
    const removeCustomerFromList = useCallback((id: number) => {
        setCustomers((prev) => prev.filter((customer) => customer.id !== id));
    }, []);

    return { customers, meta, isLoading, error, reload: loadCustomers, removeCustomerFromList };
}
