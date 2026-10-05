// src/features/users/hooks/useUserStatus.ts
// Desactivar (borrado lógico) y reactivar usuarios. Lo usa el modal de confirmación de la tabla.
import { useCallback, useState } from 'react';
import * as usersApi from '../api/users.service';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { ActionResult, UserItem } from '../model/users.types';

export function useUserStatus() {
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Envuelve cada acción con isSaving + manejo de error
    const run = useCallback(async <T,>(action: () => Promise<T>, fallback: string): Promise<ActionResult<T>> => {
        setIsSaving(true);
        setError(null);
        try {
            const data = await action();
            return { ok: true, data };
        } catch (err) {
            const message = getErrorMessage(err, fallback);
            setError(message);
            return { ok: false, error: message };
        } finally {
            setIsSaving(false);
        }
    }, []);

    const deactivateUser = useCallback(
        (id: number) => run(() => usersApi.deactivateUser(id), 'Error al desactivar el usuario'),
        [run]
    );

    const restoreUser = useCallback(
        (id: number): Promise<ActionResult<UserItem>> =>
            run(() => usersApi.updateUser(id, { is_active: true }), 'Error al reactivar el usuario'),
        [run]
    );

    // Activo → lo desactiva; inactivo → lo reactiva
    const toggleUserStatus = useCallback(
        (user: UserItem) => (user.is_active ? deactivateUser(user.id) : restoreUser(user.id)),
        [deactivateUser, restoreUser]
    );

    return { deactivateUser, restoreUser, toggleUserStatus, isSaving, error };
}