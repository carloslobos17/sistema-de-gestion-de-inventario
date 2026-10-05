// src/features/users/hooks/useUpdateUser.ts
// Actualiza un usuario enviando solo los campos que cambiaron.
import { useCallback, useState } from 'react';
import * as usersApi from '../api/users.service';
import { toUpdateUserPayload } from '../model/users.mappers';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { ActionResult, UserFormValues, UserItem } from '../model/users.types';

export function useUpdateUser() {
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateUser = useCallback(
        async (original: UserItem, values: UserFormValues): Promise<ActionResult<UserItem>> => {
            const payload = toUpdateUserPayload(values, original);

            // Nada cambió: no hace falta llamar al backend
            if (Object.keys(payload).length === 0) {
                return { ok: true, data: original };
            }

            setIsSaving(true);
            setError(null);
            try {
                const updated = await usersApi.updateUser(original.id, payload);
                return { ok: true, data: updated };
            } catch (err) {
                const message = getErrorMessage(err, 'Error al actualizar el usuario');
                setError(message);
                return { ok: false, error: message };
            } finally {
                setIsSaving(false);
            }
        },
        []
    );

    return { updateUser, isSaving, error };
}