// src/features/users/users.types.ts
// Tipos de dominio y contratos del módulo de usuarios.

// ==========================================
// DATOS DEL BACKEND
// ==========================================

export interface UserItem {
    id: number;
    role_id: number;
    role: string;
    username: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    created_at: string;
}

export interface UserFilters {
    search?: string;
    role_id?: number;
    is_active?: boolean;
}

export interface CreateUserPayload {
    role_id: number;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
}

export type UpdateUserPayload = Partial<CreateUserPayload & { is_active: boolean }>;

export type ActionResult<T = void> = { ok: true; data: T } | { ok: false; error: string };

// ==========================================
// FORMULARIO Y SELECTORES
// ==========================================

export interface UserFormValues {
    first_name: string;
    last_name: string;
    username: string;
    role_id: number;
    password: string;
    is_active: boolean;
}

export type UserFormMode = 'create' | 'edit';

export type UserStatusTab = 'active' | 'inactive';

// Opción genérica para cualquier selector o pestaña
export interface SelectOption<T = number | string> {
    value: T;
    label: string;
}