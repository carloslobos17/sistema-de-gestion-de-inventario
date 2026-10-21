// src/features/categories/hooks/useCategoryFilters.ts
// Estado de los filtros: pestaña Activas/Inactivas, búsqueda por nombre (con espera de 300 ms) y página actual.
import { useMemo, useState } from 'react';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { CATEGORY_SEARCH_DEBOUNCE_MS } from '../model/categories.constants';
import type { CategoryFilters, CategoryStatusTab } from '../model/categories.types';

export function useCategoryFilters() {
    const [status, setStatus] = useState<CategoryStatusTab>('active');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    // No se consulta al backend con cada tecla: se espera a que el usuario deje de escribir
    const debouncedSearch = useDebouncedValue(search.trim(), CATEGORY_SEARCH_DEBOUNCE_MS);

    // Si cambia la pestaña o la búsqueda, se vuelve a la página 1.
    // Se hace durante el render (no en un useEffect) para no pedir primero la página vieja con el filtro nuevo.
    const filterKey = `${status}|${debouncedSearch}`;
    const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
    if (filterKey !== prevFilterKey) {
        setPrevFilterKey(filterKey);
        setPage(1);
    }

    // Filtros listos para enviar al backend (search vacío → undefined)
    const filters = useMemo<CategoryFilters>(
        () => ({
            is_active: status === 'active',
            search: debouncedSearch || undefined,
            page,
        }),
        [status, debouncedSearch, page]
    );

    const emptyMessage = debouncedSearch
        ? 'No se encontraron categorías con ese nombre.'
        : status === 'active'
            ? 'Aún no hay categorías registradas.'
            : 'No hay categorías inactivas.';

    return { status, setStatus, search, setSearch, page, setPage, filters, emptyMessage };
}