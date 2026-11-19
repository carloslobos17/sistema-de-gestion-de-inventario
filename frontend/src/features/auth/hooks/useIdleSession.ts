// src/features/auth/hooks/useIdleSession.ts
// Vigila la inactividad: avisa a los 14 min y cierra la sesión a los 15.
// Mientras hay actividad, mantiene la sesión viva en segundo plano.
import { useCallback, useEffect, useState } from 'react';
import { ACTIVITY_EVENTS, SESSION_IDLE } from '../auth.constants';
import { authSession } from '../session/authSession';
import { getLastActivity, markActivity } from '../session/activityTracker';
import { keepSessionAlive, logout } from '../session/sessionManager';

const LISTENER_OPTIONS = { capture: true, passive: true } as const;

export function useIdleSession() {
    // null = sin aviso; número = segundos que faltan para cerrar la sesión
    const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

    useEffect(() => {
        function handleActivity() {
            markActivity();
            keepSessionAlive();
        }

        function checkIdle() {
            if (authSession.getState().status !== 'authenticated') return;

            // La actividad de cualquier pestaña cuenta (se comparte por localStorage)
            const idleMs = Date.now() - getLastActivity();
            if (idleMs >= SESSION_IDLE.LOGOUT_AFTER_MS) {
                void logout('idle');
                return;
            }

            const showWarning = idleMs >= SESSION_IDLE.WARNING_AFTER_MS;
            setSecondsLeft(showWarning ? Math.ceil((SESSION_IDLE.LOGOUT_AFTER_MS - idleMs) / 1000) : null);
        }

        ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, handleActivity, LISTENER_OPTIONS));
        const timer = window.setInterval(checkIdle, SESSION_IDLE.CHECK_INTERVAL_MS);

        return () => {
            ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, handleActivity, LISTENER_OPTIONS));
            window.clearInterval(timer);
        };
    }, []);

    // Botón "Sigo aquí"
    const stayActive = useCallback(() => {
        markActivity(true);
        keepSessionAlive();
        setSecondsLeft(null);
    }, []);

    return { secondsLeft, stayActive };
}
