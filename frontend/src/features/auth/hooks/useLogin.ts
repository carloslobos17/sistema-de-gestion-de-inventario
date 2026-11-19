// src/features/auth/hooks/useLogin.ts
// Inicia sesión y la guarda en memoria (avisa a las demás pestañas).
import { useCallback } from 'react';
import { loginWithCredentials } from '../api/auth.service';
import { completeLogin } from '../session/sessionManager';
import type { LoginCredentials } from '../auth.types';

export function useLogin() {
    const login = useCallback(async (credentials: LoginCredentials) => {
        const response = await loginWithCredentials(credentials);
        completeLogin(response.data.user, response.data.accessToken);
        return response;
    }, []);

    return { login };
}
