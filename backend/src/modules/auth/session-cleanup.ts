// src/modules/auth/session-cleanup.ts
// Borra cada hora las sesiones vencidas para que la tabla refresh_tokens no crezca sin límite.
import { refreshTokenRepository } from './refresh-token.repository';

const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1 hora

async function cleanExpiredSessions(): Promise<void> {
    try {
        const { count } = await refreshTokenRepository.deleteAllExpired();
        if (count > 0) console.log(`[sesiones] ${count} sesiones vencidas eliminadas`);
    } catch (error) {
        // Si falla (BD caída, etc.) no tumba el servidor: se reintenta en la siguiente hora
        console.error('[sesiones] No se pudieron limpiar las sesiones vencidas', error);
    }
}

// Limpia una vez al arrancar y luego cada hora
export function startSessionCleanup(): void {
    void cleanExpiredSessions();
    setInterval(() => void cleanExpiredSessions(), CLEANUP_INTERVAL_MS).unref();
}