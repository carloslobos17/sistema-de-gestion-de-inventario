// src/features/auth/hooks/useLogout.ts
// Cierra la sesión en el servidor y en todas las pestañas; ProtectedRoute lleva al login.
import { useCallback } from 'react';
import { logout } from '../session/sessionManager';

export function useLogout(): () => Promise<void> {
    return useCallback(() => logout('logout'), []);
}
