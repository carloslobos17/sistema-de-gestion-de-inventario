// src/features/users/hooks/useUser.ts
// Carga un solo usuario por ID (para precargar el formulario de edición).
import { useEffect, useState } from 'react';
import * as usersApi from '../api/users.service';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { UserItem } from '../model/users.types';

export function useUser(id: number) {
    const isValidId = Number.isInteger(id) && id > 0;

    const [user, setUser] = useState<UserItem | null>(null);
    const [isLoading, setIsLoading] = useState(isValidId);
    const [error, setError] = useState<string | null>(isValidId ? null : 'El ID de usuario no es válido.');

    useEffect(() => {
        if (!isValidId) return;

        // Si cambia el ID o se sale de la página antes de que responda, se ignora la respuesta
        let cancelled = false;

        setIsLoading(true);
        setError(null);

        usersApi
            .fetchUserById(id)
            .then((data) => {
                if (!cancelled) setUser(data);
            })
            .catch((err) => {
                if (!cancelled) setError(getErrorMessage(err, 'Error al cargar la información del usuario'));
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [id, isValidId]);

    return { user, isLoading, error };
}