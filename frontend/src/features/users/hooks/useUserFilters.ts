// src/features/users/hooks/useUserFilters.ts
// Estado de los filtros del listado: pestaña activos/inactivos, búsqueda y rol.
import { useCallback, useMemo, useState } from 'react';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { SEARCH_DEBOUNCE_MS } from '../model/users.constants';
import type { UserFilters, UserStatusTab } from '../model/users.types';

export function useUserFilters() {
    const [status, setStatus] = useState<UserStatusTab>('active');
    const [search, setSearch] = useState('');
    const [roleId, setRoleId] = useState<number | undefined>(undefined);

    const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS);

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
        }),
        [status, debouncedSearch, roleId]
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
        filters,
        emptyMessage,
    };
}
