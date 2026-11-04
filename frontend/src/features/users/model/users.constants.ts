import { ROLE_IDS } from '../../auth/auth.roles';
import type { SelectOption, UserFormValues, UserStatusTab } from './users.types';

// 1. Diccionario de traducción para mostrar en la tabla (ID -> Español).
//    Los IDs vienen de ROLE_IDS (auth.roles.ts): única fuente en el frontend.
export const ROLE_LABELS: Record<number, string> = {
    [ROLE_IDS.ADMIN]: 'Administrador',
    [ROLE_IDS.SELLER]: 'Vendedor',
};

// 2. Opciones para los <select> (Filtros y Formulario)
export const ROLE_OPTIONS: SelectOption<number>[] = [
    { value: ROLE_IDS.ADMIN, label: 'Administrador' },
    { value: ROLE_IDS.SELLER, label: 'Vendedor' },
];

export const STATUS_TABS: SelectOption<UserStatusTab>[] = [
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' },
];

export const EMPTY_USER_FORM: UserFormValues = {
    first_name: '',
    last_name: '',
    username: '',
    role_id: ROLE_IDS.SELLER,
    password: '',
    is_active: true,
};

export const SEARCH_DEBOUNCE_MS = 300;