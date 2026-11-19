// src/features/auth/session/authSession.ts
// Estado de la sesión EN MEMORIA (nada en localStorage: no se puede leer ni editar desde DevTools).
// React lo lee con useSyncExternalStore; axios lo lee directo para poner el token.
import type { AuthUser, SessionEndReason, SessionState } from '../auth.types';

let state: SessionState = {
    status: 'loading',
    user: null,
    accessToken: null,
    tokenReceivedAt: null,
    endReason: null,
};

const listeners = new Set<() => void>();

function setState(next: SessionState): void {
    state = next;
    listeners.forEach((listener) => listener());
}

export const authSession = {
    getState(): SessionState {
        return state;
    },

    subscribe(listener: () => void): () => void {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    },

    // Login o renovación: guarda el usuario (con sus permisos actuales) y el access token
    start(user: AuthUser, accessToken: string): void {
        setState({ status: 'authenticated', user, accessToken, tokenReceivedAt: Date.now(), endReason: null });
    },

    // Sin sesión. reason = null cuando simplemente no había sesión (primera visita)
    end(reason: SessionEndReason | null): void {
        setState({ status: 'anonymous', user: null, accessToken: null, tokenReceivedAt: null, endReason: reason });
    },
};
