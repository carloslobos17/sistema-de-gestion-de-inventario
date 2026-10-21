// src/features/categories/hooks/useCategoryFilters.ts
// Estado de los filtros: pestaña Activas/Inactivas y búsqueda por nombre (con espera de 300 ms).
import { useMemo, useState } from 'react';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { CATEGORY_SEARCH_DEBOUNCE_MS } from '../model/categories.constants';
import type { CategoryFilters, CategoryStatusTab } from '../model/categories.types';

export function useCategoryFilters() {
    const [status, setStatus] = useState<CategoryStatusTab>('active');
    const [search, setSearch] = useState('');

    // No se consulta al backend con cada tecla: se espera a que el usuario deje de escribir
    const debouncedSearch = useDebouncedValue(search.trim(), CATEGORY_SEARCH_DEBOUNCE_MS);

    // Filtros listos para enviar al backend (search vacío → undefined)
    const filters = useMemo<CategoryFilters>(
        () => ({
            is_active: status === 'active',
            search: debouncedSearch || undefined,
        }),
        [status, debouncedSearch]
    );

    const emptyMessage = debouncedSearch
        ? 'No se encontraron categorías con ese nombre.'
        : status === 'active'
            ? 'Aún no hay categorías registradas.'
            : 'No hay categorías inactivas.';

    return { status, setStatus, search, setSearch, filters, emptyMessage };
}