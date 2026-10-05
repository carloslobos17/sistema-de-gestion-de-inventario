// src/features/users/users.constants.ts
import type { SelectOption, UserFormValues, UserStatusTab } from './users.types';

// 1. IDs fijos de los roles en la base de datos
export const USER_ROLES = {
    ADMIN: 1,
    SELLER: 2,
} as const;

// 2. Diccionario de traducción para mostrar en la tabla (ID -> Español)
export const ROLE_LABELS: Record<number, string> = {
    [USER_ROLES.ADMIN]: 'Administrador',
    [USER_ROLES.SELLER]: 'Vendedor',
};

// 3. Opciones para los <select> (Filtros y Formulario)
export const ROLE_OPTIONS: SelectOption<number>[] = [
    { value: USER_ROLES.ADMIN, label: 'Administrador' },
    { value: USER_ROLES.SELLER, label: 'Vendedor' },
];

export const STATUS_TABS: SelectOption<UserStatusTab>[] = [
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' },
];

export const EMPTY_USER_FORM: UserFormValues = {
    first_name: '',
    last_name: '',
    username: '',
    role_id: USER_ROLES.SELLER,
    password: '',
    is_active: true,
};

export const SEARCH_DEBOUNCE_MS = 300;