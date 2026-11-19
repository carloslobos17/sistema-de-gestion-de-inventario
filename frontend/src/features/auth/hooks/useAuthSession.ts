// src/features/auth/hooks/useAuthSession.ts
// Estado completo de la sesión (cargando / con sesión / sin sesión y por qué terminó).
import { useSyncExternalStore } from 'react';
import { authSession } from '../session/authSession';
import type { SessionState } from '../auth.types';

export function useAuthSession(): SessionState {
    return useSyncExternalStore(authSession.subscribe, authSession.getState);
}
