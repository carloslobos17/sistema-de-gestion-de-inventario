// src/features/customers/hooks/useCustomerFilters.ts
// Estado de los filtros: pestaña Activos/Inactivos, tipo de cliente, búsqueda y página actual.
// Activos e inactivos NUNCA se mezclan: siempre se envía is_active según la pestaña.
import { useMemo, useState } from 'react';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { CUSTOMER_SEARCH_DEBOUNCE_MS } from '../model/customers.constants';
import type { CustomerFilters, CustomerStatusTab, CustomerTypeFilter } from '../model/customers.types';

export function useCustomerFilters() {
    const [status, setStatus] = useState<CustomerStatusTab>('active');
    const [customerType, setCustomerType] = useState<CustomerTypeFilter>('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    // No se consulta al backend con cada tecla: se espera a que el usuario deje de escribir
    const debouncedSearch = useDebouncedValue(search.trim(), CUSTOMER_SEARCH_DEBOUNCE_MS);

    // Si cambia la pestaña, el tipo o la búsqueda, se vuelve a la página 1.
    // Se hace durante el render (no en un useEffect) para no pedir primero la página vieja con el filtro nuevo.
    const filterKey = `${status}|${customerType}|${debouncedSearch}`;
    const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
    if (filterKey !== prevFilterKey) {
        setPrevFilterKey(filterKey);
        setPage(1);
    }

    // Filtros listos para enviar al backend (vacíos → undefined)
    const filters = useMemo<CustomerFilters>(
        () => ({
            is_active: status === 'active',
            customer_type: customerType || undefined,
            search: debouncedSearch || undefined,
            page,
        }),
        [status, customerType, debouncedSearch, page]
    );

    const hasSearch = debouncedSearch.length > 0;

    const emptyMessage = hasSearch
        ? `No se encontraron clientes con «${debouncedSearch}».`
        : status === 'active'
            ? 'Aún no hay clientes registrados.'
            : 'No hay clientes inactivos.';

    const clearSearch = () => setSearch('');

    return {
        status,
        setStatus,
        customerType,
        setCustomerType,
        search,
        setSearch,
        clearSearch,
        hasSearch,
        page,
        setPage,
        filters,
        emptyMessage,
    };
}
