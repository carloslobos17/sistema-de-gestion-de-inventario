// src/features/users/hooks/useUserForm.ts
// Estado del formulario de usuario (lo que el usuario va escribiendo).
import { useCallback, useState, type ChangeEvent } from 'react';
import { EMPTY_USER_FORM } from '../model/users.constants';
import type { UserFormValues } from '../model/users.types';

export function useUserForm(initialValues: UserFormValues = EMPTY_USER_FORM) {
    const [values, setValues] = useState<UserFormValues>(initialValues);

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setValues((prev) => ({
            ...prev,
            [name]:
                type === 'checkbox'
                    ? (e.target as HTMLInputElement).checked
                    : name === 'role_id'
                        ? Number(value)
                        : value,
        }));
    }, []);

    return { values, handleChange };
}
