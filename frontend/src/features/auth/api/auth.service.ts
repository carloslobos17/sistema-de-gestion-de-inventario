// src/features/auth/api/auth.service.ts
// Único archivo que habla con el backend para autenticación (login, renovación y cierre de sesión).
import { authClient } from '../../../api/authClient';
import { toApiError } from '../../../api/apiError';
import type { LoginCredentials, SessionResponse } from '../auth.types';

export async function loginWithCredentials(credentials: LoginCredentials): Promise<SessionResponse> {
    try {
        const response = await authClient.post<SessionResponse>('/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw toApiError(error, 'No se pudo iniciar sesión');
    }
}

// Sin body: el refresh token viaja solo en la cookie httpOnly.
// El error se deja tal cual para que quien llama revise si fue 401.
export async function requestSessionRefresh(): Promise<SessionResponse> {
    const response = await authClient.post<SessionResponse>('/auth/refresh');
    return response.data;
}

export async function requestLogout(): Promise<void> {
    await authClient.post('/auth/logout');
}
