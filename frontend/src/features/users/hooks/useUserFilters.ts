// src/features/users/hooks/useUserFilters.ts
// Estado de los filtros del listado: pestaña activos/inactivos, búsqueda, rol y página actual.
import { useCallback, useMemo, useState } from 'react';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { SEARCH_DEBOUNCE_MS } from '../model/users.constants';
import type { UserFilters, UserStatusTab } from '../model/users.types';

export function useUserFilters() {
    const [status, setStatus] = useState<UserStatusTab>('active');
    const [search, setSearch] = useState('');
    const [roleId, setRoleId] = useState<number | undefined>(undefined);
    const [page, setPage] = useState(1);

    const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS);

    // Si cambia la pestaña, la búsqueda o el rol, se vuelve a la página 1.
    // Se hace durante el render (no en un useEffect) para no pedir primero la página vieja con el filtro nuevo.
    const filterKey = `${status}|${debouncedSearch}|${roleId ?? ''}`;
    const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
    if (filterKey !== prevFilterKey) {
        setPrevFilterKey(filterKey);
        setPage(1);
    }

    // El <select> entrega texto; "" significa "todos los roles"
    const changeRole = useCallback((value: string) => {
        setRoleId(value ? Number(value) : undefined);
    }, []);

    // Filtros listos para enviar al backend
    const filters = useMemo<UserFilters>(
        () => ({
            is_active: status === 'active',
            search: debouncedSearch || undefined,
            role_id: roleId,
            page,
        }),
        [status, debouncedSearch, roleId, page]
    );

    const hasFilters = Boolean(debouncedSearch || roleId);

    const emptyMessage = hasFilters
        ? 'No se encontraron usuarios con esos filtros.'
        : status === 'active'
            ? 'Aún no hay usuarios registrados.'
            : 'No hay usuarios inactivos.';

    return {
        status,
        setStatus,
        search,
        setSearch,
        roleId,
        changeRole,
        page,
        setPage,
        filters,
        emptyMessage,
    };
}
