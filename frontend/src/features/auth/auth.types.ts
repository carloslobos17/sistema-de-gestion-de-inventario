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
}

export interface LoginResponse {
    message: string;
    data: {
        user: AuthUser;
        accessToken: string;
        refreshToken: string;
    };
}