export interface User {
    id: number;
    role_id: number;
    username: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    created_at: Date;
}


export interface UserWithCredentials extends User {
    password_hash: string;
    role: string;
}

export interface UserListed extends User {
    role: string;
}

export interface CreateUserData {
    role_id: number;
    username: string;
    first_name: string;
    last_name: string;
    password_hash: string;
}


export type UpdateUserData = Partial<CreateUserData & { is_active: boolean }>;

export interface RefreshTokenData {
    id: number;
    user_id: number;
    token: string;
    expires_at: Date;
    is_revoked: boolean;
}


export interface UserFilters {
    search?: string;     // Buscará en username, first_name o last_name
    role_id?: number;    // Filtrar por un rol específico
    is_active?: boolean; // Filtrar activos/inactivos
}