// src/modules/auth/refresh-token.util.ts
// Crea refresh tokens aleatorios, calcula su huella SHA-256 y los tiempos de la sesión.
import { createHash, randomBytes } from 'node:crypto';

const DEFAULT_IDLE_MINUTES = 30; // red de seguridad: sin renovar en 30 min, la sesión muere
const DEFAULT_MAX_HOURS = 12; // máximo por jornada, aunque la usen sin parar
const DEFAULT_MAX_SESSIONS = 5;

// Lee un número positivo del .env; si falta o es inválido, usa el valor por defecto
function readPositiveNumber(name: string, fallback: number): number {
    const value = Number(process.env[name] ?? fallback);
    return Number.isFinite(value) && value > 0 ? value : fallback;
}

// 48 bytes aleatorios = imposible de adivinar; base64url para que viaje bien en la cookie
export function generateRefreshToken(): string {
    return randomBytes(48).toString('base64url');
}

// SHA-256 y no bcrypt: el token ya es aleatorio (no hay que frenar ataques de diccionario)
// y así se puede buscar directo por índice único
export function hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
}

// Fin de la jornada: se calcula una sola vez, en el login (SESSION_MAX_HOURS)
export function getSessionDeadline(): Date {
    const hours = readPositiveNumber('SESSION_MAX_HOURS', DEFAULT_MAX_HOURS);
    return new Date(Date.now() + hours * 60 * 60 * 1000);
}

// Vencimiento por inactividad (SESSION_IDLE_MINUTES), sin pasarse nunca del fin de la jornada
export function getIdleExpiresAt(sessionDeadline: Date): Date {
    const minutes = readPositiveNumber('SESSION_IDLE_MINUTES', DEFAULT_IDLE_MINUTES);
    const idleLimit = Date.now() + minutes * 60 * 1000;
    return new Date(Math.min(idleLimit, sessionDeadline.getTime()));
}

// Máximo de sesiones abiertas a la vez por usuario (MAX_SESSIONS_PER_USER)
export function getMaxSessionsPerUser(): number {
    const max = readPositiveNumber('MAX_SESSIONS_PER_USER', DEFAULT_MAX_SESSIONS);
    return Number.isInteger(max) ? max : DEFAULT_MAX_SESSIONS;
}