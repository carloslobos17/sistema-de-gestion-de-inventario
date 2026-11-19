// src/features/auth/hooks/useCurrentUser.ts
// Usuario logueado, leído de la sesión en memoria. Se actualiza solo al renovar (permisos al día).
import { useSyncExternalStore } from 'react';
import { authSession } from '../session/authSession';
import type { AuthUser } from '../auth.types';

function getCurrentUser(): AuthUser | null {
    return authSession.getState().user;
}

export function useCurrentUser(): AuthUser | null {
    return useSyncExternalStore(authSession.subscribe, getCurrentUser);
}
