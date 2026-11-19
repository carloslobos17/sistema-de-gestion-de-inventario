// src/features/auth/auth.types.ts
// Tipos del inicio de sesión, del usuario logueado y del estado de la sesión.

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

// Respuesta de /auth/login y /auth/refresh (el refresh token viaja en la cookie, no aquí)
export interface SessionResponse {
    message: string;
    data: {
        user: AuthUser;
        accessToken: string;
    };
}

// loading = se está recuperando la sesión al abrir la app (F5)
export type SessionStatus = 'loading' | 'authenticated' | 'anonymous';

// Por qué terminó la sesión (para el mensaje del login)
export type SessionEndReason = 'logout' | 'expired' | 'idle';

export interface SessionState {
    status: SessionStatus;
    user: AuthUser | null;
    accessToken: string | null;
    tokenReceivedAt: number | null; // cuándo llegó el access token (para renovarlo con tiempo)
    endReason: SessionEndReason | null;
}

export interface IdleWarningDialogProps {
    secondsLeft: number;
    onStay: () => void;
    onLogout: () => void;
}
