// src/features/auth/session/sessionManager.ts
// Orquesta la sesión: la recupera al abrir la app (F5), la renueva una sola vez aunque fallen
// muchas peticiones a la vez, y sincroniza el inicio y el cierre de sesión entre pestañas.
import { isAxiosError } from 'axios';
import { requestLogout, requestSessionRefresh } from '../api/auth.service';
import { SESSION_IDLE } from '../auth.constants';
import { authSession } from './authSession';
import { markActivity } from './activityTracker';
import type { AuthUser, SessionEndReason } from '../auth.types';

const REFRESH_LOCK_NAME = 'constru-auth-refresh';
const LEGACY_STORAGE_KEYS = ['token', 'user']; // la versión anterior guardaba la sesión aquí

type SessionMessage = { type: 'login' } | { type: 'logout'; reason: SessionEndReason };

// Canal entre pestañas del mismo navegador (si el navegador no lo soporta, cada pestaña va sola)
const channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('constru-auth');

let refreshInFlight: Promise<string | null> | null = null;
let logoutCount = 0; // si hubo logout mientras se renovaba, la renovación se descarta
let initialized = false;

// Solo una pestaña renueva a la vez: la otra espera y usa la cookie ya renovada
function withRefreshLock<T>(task: () => Promise<T>): Promise<T> {
    if ('locks' in navigator) return navigator.locks.request(REFRESH_LOCK_NAME, task);
    return task();
}

async function performRefresh(reasonIfRejected: SessionEndReason | null): Promise<string | null> {
    const logoutsBefore = logoutCount;
    try {
        const { data } = await withRefreshLock(requestSessionRefresh);
        if (logoutCount !== logoutsBefore) return null;

        authSession.start(data.user, data.accessToken); // trae también los permisos actuales
        return data.accessToken;
    } catch (error) {
        // 401 = la sesión ya no existe en el servidor. Otro error (sin red, servidor caído) no cierra la sesión.
        if (isAxiosError(error) && error.response?.status === 401) authSession.end(reasonIfRejected);
        return null;
    }
}

// Renueva la sesión. Si ya hay una renovación en curso, todos esperan esa misma.
export function refreshSession(reasonIfRejected: SessionEndReason | null = 'expired'): Promise<string | null> {
    refreshInFlight ??= performRefresh(reasonIfRejected).finally(() => {
        refreshInFlight = null;
    });
    return refreshInFlight;
}

// Llamado cuando hay actividad: si el token ya tiene un rato, se renueva en segundo plano.
// Así la sesión nunca vence mientras alguien llena un formulario largo sin guardar.
export function keepSessionAlive(): void {
    const { status, tokenReceivedAt } = authSession.getState();
    if (status !== 'authenticated' || tokenReceivedAt === null) return;
    if (Date.now() - tokenReceivedAt >= SESSION_IDLE.KEEP_ALIVE_AFTER_MS) void refreshSession();
}

export function completeLogin(user: AuthUser, accessToken: string): void {
    markActivity(true); // el login cuenta como actividad: empieza a contar la inactividad desde aquí
    authSession.start(user, accessToken);
    channel?.postMessage({ type: 'login' } satisfies SessionMessage);
}

// Cierra la sesión en esta pestaña, en las demás y en el servidor
export async function logout(reason: SessionEndReason = 'logout'): Promise<void> {
    logoutCount += 1;
    authSession.end(reason);
    channel?.postMessage({ type: 'logout', reason } satisfies SessionMessage);

    try {
        await requestLogout();
    } catch {
        // Sin conexión: la sesión ya se cerró aquí; el servidor la vencerá sola por inactividad
    }
}

function listenToOtherTabs(): void {
    channel?.addEventListener('message', (event: MessageEvent<SessionMessage>) => {
        const message = event.data;
        if (message.type === 'logout') {
            logoutCount += 1;
            authSession.end(message.reason);
        }
        // Otra pestaña inició sesión: esta la recupera con la cookie compartida
        if (message.type === 'login' && authSession.getState().status !== 'authenticated') {
            void refreshSession(null);
        }
    });
}

// Al abrir o recargar la app (F5): recupera la sesión con la cookie. Se ejecuta una sola vez.
export function initSession(): void {
    if (initialized) return;
    initialized = true;

    LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    listenToOtherTabs();

    void refreshSession(null).then((token) => {
        // Sin sesión o sin conexión: se muestra el login
        if (!token && authSession.getState().status === 'loading') authSession.end(null);
    });
}
