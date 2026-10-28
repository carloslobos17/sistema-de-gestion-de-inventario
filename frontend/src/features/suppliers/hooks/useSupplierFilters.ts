// src/features/suppliers/hooks/useSupplierFilters.ts
// Estado de los filtros: pestaña Activos/Inactivos, búsqueda (nombre, razón social, contacto, documento o NRC) y página actual.
import { useMemo, useState } from 'react';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { SUPPLIER_SEARCH_DEBOUNCE_MS } from '../model/suppliers.constants';
import type { SupplierFilters, SupplierStatusTab } from '../model/suppliers.types';

export function useSupplierFilters() {
    const [status, setStatus] = useState<SupplierStatusTab>('active');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    // No se consulta al backend con cada tecla: se espera a que el usuario deje de escribir
    const debouncedSearch = useDebouncedValue(search.trim(), SUPPLIER_SEARCH_DEBOUNCE_MS);

    // Si cambia la pestaña o la búsqueda, se vuelve a la página 1.
    // Se hace durante el render (no en un useEffect) para no pedir primero la página vieja con el filtro nuevo.
    const filterKey = `${status}|${debouncedSearch}`;
    const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
    if (filterKey !== prevFilterKey) {
        setPrevFilterKey(filterKey);
        setPage(1);
    }

    // Filtros listos para enviar al backend (search vacío → undefined)
    const filters = useMemo<SupplierFilters>(
        () => ({
            is_active: status === 'active',
            search: debouncedSearch || undefined,
            page,
        }),
        [status, debouncedSearch, page]
    );

    const emptyMessage = debouncedSearch
        ? 'No se encontraron proveedores con esa búsqueda.'
        : status === 'active'
            ? 'Aún no hay proveedores registrados.'
            : 'No hay proveedores inactivos.';

    return { status, setStatus, search, setSearch, page, setPage, filters, emptyMessage };
}