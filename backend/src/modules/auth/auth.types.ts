// src/modules/auth/auth.types.ts
// Tipos del inicio de sesión, la renovación de sesión y el cierre de sesión.

export interface JwtPayload {
    userId: number;
    roleId: number;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

// Usuario que se envía al frontend (mismo formato que ya devolvía el login)
export interface AuthUser {
    id: number;
    first_name: string;
    last_name: string;
    role_id: number;
    role: string;
    can_manage_structure: boolean;
}

// Datos para guardar una sesión nueva (en el login o al rotar)
export interface NewSessionData {
    userId: number;
    tokenHash: string;
    expiresAt: Date; // vence por inactividad
    sessionExpiresAt: Date; // fin de la jornada
}

// Sesión emitida: user y accessToken van en el JSON; refreshToken solo en la cookie httpOnly
export interface AuthSession {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
    refreshExpiresAt: Date;
}