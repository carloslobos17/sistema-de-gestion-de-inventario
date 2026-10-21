// src/features/auth/auth.types.ts
// Tipos del inicio de sesión y del usuario logueado.

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginFormErrors {
    username?: string;
    password?: string;
    general?: string;
}

export interface AuthUser {
    id: number;
    first_name: string;
    last_name: string;
    role_id: number;
    role: string;
    can_manage_structure: boolean;
}

export interface LoginResponse {
    message: string;
    data: {
        user: AuthUser;
        accessToken: string;
        refreshToken: string;
    };
}