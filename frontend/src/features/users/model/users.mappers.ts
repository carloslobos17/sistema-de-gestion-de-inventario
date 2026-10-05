// src/features/users/users.mappers.ts
// Funciones puras que convierten datos de una forma a otra.
import type { CreateUserPayload, UpdateUserPayload, UserFormValues, UserItem } from './users.types';

// Usuario del backend → valores iniciales del formulario (la contraseña nunca se devuelve)
export function toUserFormValues(user: UserItem): UserFormValues {
    return {
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        role_id: user.role_id,
        password: '',
        is_active: user.is_active,
    };
}

// Formulario → body de POST /api/users
export function toCreateUserPayload(values: UserFormValues): CreateUserPayload {
    return {
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        username: values.username.trim(),
        role_id: values.role_id,
        password: values.password,
    };
}

// Formulario → body de PATCH /api/users/:id.
// Si se conoce el usuario original, solo se envían los campos que cambiaron.
// La contraseña solo se envía si se escribió una nueva.
export function toUpdateUserPayload(values: UserFormValues, original?: UserItem): UpdateUserPayload {
    const payload: UpdateUserPayload = {};
    const changed = <T,>(value: T, originalValue: T | undefined) => !original || value !== originalValue;

    const firstName = values.first_name.trim();
    const lastName = values.last_name.trim();
    const username = values.username.trim();

    if (changed(firstName, original?.first_name)) payload.first_name = firstName;
    if (changed(lastName, original?.last_name)) payload.last_name = lastName;
    if (changed(username, original?.username)) payload.username = username;
    if (changed(values.role_id, original?.role_id)) payload.role_id = values.role_id;
    if (changed(values.is_active, original?.is_active)) payload.is_active = values.is_active;
    if (values.password) payload.password = values.password;

    return payload;
}
