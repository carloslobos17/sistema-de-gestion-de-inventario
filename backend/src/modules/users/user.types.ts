// src/modules/users/user.types.ts
// Tipos del módulo de usuarios (backend).

export interface User {
    id: number;
    role_id: number;
    username: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    created_at: Date;
}

// Usuario con el nombre de su rol (lo que se devuelve al frontend)
export interface UserListed extends User {
    role: string;
}

// Solo para verificar credenciales en el login
export interface UserWithCredentials extends UserListed {
    password_hash: string;
}

// Lo que se escribe en la BD al crear (password ya convertido a hash)
export interface CreateUserData {
    role_id: number;
    username: string;
    first_name: string;
    last_name: string;
    password_hash: string;
}

// Lo que se escribe en la BD al editar (password ya convertido a hash)
export type UpdateUserData = Partial<CreateUserData & { is_active: boolean }>;

// Filtros del listado: GET /api/users?search=&role_id=&is_active=
// (page y limit van aparte, como PaginationParams)
export interface UserFilters {
    search?: string;     // busca en username, first_name o last_name
    role_id?: number;    // filtrar por un rol específico
    is_active?: boolean; // filtrar activos / inactivos
}

export interface RefreshTokenData {
    id: number;
    user_id: number;
    token: string;
    expires_at: Date;
    is_revoked: boolean;
}
