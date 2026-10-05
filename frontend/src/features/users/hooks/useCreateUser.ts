// src/features/users/hooks/useCreateUser.ts
// Crea un usuario a partir de los valores del formulario.
import { useCallback, useState } from 'react';
import * as usersApi from '../api/users.service';
import { toCreateUserPayload } from '../model/users.mappers';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { ActionResult, UserFormValues, UserItem } from '../model/users.types';

export function useCreateUser() {
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createUser = useCallback(async (values: UserFormValues): Promise<ActionResult<UserItem>> => {
        setIsSaving(true);
        setError(null);
        try {
            const created = await usersApi.createUser(toCreateUserPayload(values));
            return { ok: true, data: created };
        } catch (err) {
            const message = getErrorMessage(err, 'Error al crear el usuario');
            setError(message);
            return { ok: false, error: message };
        } finally {
            setIsSaving(false);
        }
    }, []);

    return { createUser, isSaving, error };
}