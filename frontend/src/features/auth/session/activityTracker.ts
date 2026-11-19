// src/features/auth/session/activityTracker.ts
// Guarda la hora de la última actividad (mouse, teclado, toques), compartida entre pestañas:
// así una pestaña olvidada no cierra la sesión de la que sí se está usando.
// Solo es una hora (número), no es un dato sensible.
const STORAGE_KEY = 'constru:last-activity';
const WRITE_THROTTLE_MS = 5000; // no escribe más de una vez cada 5 s

let lastWrite = 0;

export function markActivity(force = false): void {
    const now = Date.now();
    if (!force && now - lastWrite < WRITE_THROTTLE_MS) return;
    lastWrite = now;
    localStorage.setItem(STORAGE_KEY, String(now));
}

export function getLastActivity(): number {
    const value = Number(localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(value) && value > 0 ? value : Date.now();
}
