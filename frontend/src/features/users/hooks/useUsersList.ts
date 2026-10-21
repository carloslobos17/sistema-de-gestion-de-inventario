// src/features/users/hooks/useUsersList.ts
// Carga una página de usuarios y la vuelve a cargar cada vez que cambian los filtros o la página.
import { useCallback, useEffect, useRef, useState } from 'react';
import * as usersApi from '../api/users.service';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { PaginationMeta } from '../../../types/common';
import type { UserFilters, UserItem } from '../model/users.types';

// onPageOutOfRange: se llama con la última página válida cuando la actual quedó vacía
// (ej. se desactivó el único usuario de la página 3 → hay que ir a la 2)
export function useUsersList(filters: UserFilters, onPageOutOfRange?: (lastPage: number) => void) {
    const [users, setUsers] = useState<UserItem[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Evita que una respuesta vieja pise a una nueva (ej. al escribir rápido en el buscador)
    const requestIdRef = useRef(0);

    // Se usan los campos sueltos como dependencias para no recargar si solo cambia la referencia del objeto
    const { search, role_id, is_active, page } = filters;

    const loadUsers = useCallback(async () => {
        const requestId = ++requestIdRef.current;
        const isLatest = () => requestId === requestIdRef.current;

        setIsLoading(true);
        setError(null);
        try {
            const result = await usersApi.fetchUsers({ search, role_id, is_active, page });
            if (isLatest()) {
                setUsers(result.data);
                setMeta(result.meta);
            }
        } catch (err) {
            if (isLatest()) setError(getErrorMessage(err, 'Error al cargar los usuarios'));
        } finally {
            if (isLatest()) setIsLoading(false);
        }
    }, [search, role_id, is_active, page]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // La página pedida ya no existe (quedó vacía) → ir a la última que sí tiene datos
    useEffect(() => {
        if (!meta || !onPageOutOfRange) return;
        const lastPage = Math.max(meta.totalPages, 1);
        if (meta.page > lastPage) onPageOutOfRange(lastPage);
    }, [meta, onPageOutOfRange]);

    // Quita un usuario de la tabla al instante (después se recarga para rellenar la página)
    const removeUserFromList = useCallback((id: number) => {
        setUsers((prev) => prev.filter((user) => user.id !== id));
    }, []);

    return {
        users,
        meta,
        isLoading,
        error,
        reload: loadUsers,
        removeUserFromList,
    };
}
