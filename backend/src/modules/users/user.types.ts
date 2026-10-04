export interface User {
    id: number;
    role_id: number;
    username: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    created_at: Date;
}


// Solo para verificar credenciales en el login
export interface UserWithCredentials extends User {
    password_hash: string;
    role: string; // nombre del rol
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

export interface RefreshTokenData {
    id: number;
    user_id: number;
    token: string;
    expires_at: Date;
    is_revoked: boolean;
}




