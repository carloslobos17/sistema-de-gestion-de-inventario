// src/features/users/hooks/useUsersList.ts
// Carga la lista de usuarios y la vuelve a cargar cada vez que cambian los filtros.
import { useCallback, useEffect, useRef, useState } from 'react';
import * as usersApi from '../api/users.service';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { UserFilters, UserItem } from '../model/users.types';

export function useUsersList(filters: UserFilters) {
    const [users, setUsers] = useState<UserItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Evita que una respuesta vieja pise a una nueva (ej. al escribir rápido en el buscador)
    const requestIdRef = useRef(0);

    // Se usan los campos sueltos como dependencias para no recargar si solo cambia la referencia del objeto
    const { search, role_id, is_active } = filters;

    const loadUsers = useCallback(async () => {
        const requestId = ++requestIdRef.current;
        const isLatest = () => requestId === requestIdRef.current;

        setIsLoading(true);
        setError(null);
        try {
            const data = await usersApi.fetchUsers({ search, role_id, is_active });
            if (isLatest()) setUsers(data);
        } catch (err) {
            if (isLatest()) setError(getErrorMessage(err, 'Error al cargar los usuarios'));
        } finally {
            if (isLatest()) setIsLoading(false);
        }
    }, [search, role_id, is_active]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // Quita un usuario de la tabla sin recargar (ej. después de desactivarlo o restaurarlo)
    const removeUserFromList = useCallback((id: number) => {
        setUsers((prev) => prev.filter((user) => user.id !== id));
    }, []);

    return {
        users,
        isLoading,
        error,
        reload: loadUsers,
        removeUserFromList,
    };
}
