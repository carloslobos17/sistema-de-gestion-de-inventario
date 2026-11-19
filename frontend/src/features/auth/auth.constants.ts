// src/features/auth/auth.constants.ts
// Tiempos de inactividad de la sesión y mensajes que se muestran en el login.
import type { SessionEndReason } from './auth.types';

const MINUTE_MS = 60 * 1000;

export const SESSION_IDLE = {
    WARNING_AFTER_MS: 14 * MINUTE_MS, // aviso "¿Sigues ahí?"
    LOGOUT_AFTER_MS: 15 * MINUTE_MS, // cierre de sesión por inactividad
    CHECK_INTERVAL_MS: 1000, // cada cuánto se revisa
    KEEP_ALIVE_AFTER_MS: 10 * MINUTE_MS, // si hay actividad y el token tiene más de esto, se renueva
} as const;

// Lo que cuenta como "alguien está usando el equipo"
export const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel', 'scroll'] as const;

// Mensaje del login según por qué terminó la sesión (el logout normal no muestra nada)
export const SESSION_END_MESSAGES: Partial<Record<SessionEndReason, string>> = {
    expired: 'Tu sesión expiró. Inicia sesión de nuevo.',
    idle: 'Cerramos tu sesión por inactividad. Inicia sesión de nuevo.',
};
