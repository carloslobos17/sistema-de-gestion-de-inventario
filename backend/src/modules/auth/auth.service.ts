// src/modules/auth/auth.service.ts
// Lógica de sesión: login, renovación con rotación (y detección de reuso) y logout.
import bcrypt from 'bcrypt';
import { RevokeReason } from '@prisma/client';
import { AppError } from '../../utils/AppError';
import { generateAccessToken } from '../../utils/jwt.util';
import { UserRepository } from '../users/user.repository';
import { refreshTokenRepository } from './refresh-token.repository';
import {
    generateRefreshToken,
    getIdleExpiresAt,
    getMaxSessionsPerUser,
    getSessionDeadline,
    hashRefreshToken,
} from './refresh-token.util';
import type { AuthSession, AuthUser, LoginCredentials } from './auth.types';

const userRepository = new UserRepository();

const AUTH_MESSAGES = {
    INVALID_CREDENTIALS: 'Usuario o contraseña incorrectos',
    SESSION_EXPIRED: 'Tu sesión expiró. Inicia sesión de nuevo.',
} as const;

// Margen para dos pestañas que renuevan a la vez con el mismo token: no se toma como robo
const ROTATION_GRACE_MS = 10_000;

// Copia solo los campos públicos
function toAuthUser(user: AuthUser): AuthUser {
    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        role_id: user.role_id,
        role: user.role,
        can_manage_structure: user.can_manage_structure,
    };
}

function sessionExpired(): AppError {
    return new AppError(AUTH_MESSAGES.SESSION_EXPIRED, 401);
}

export class AuthService {
    async login({ username, password }: LoginCredentials): Promise<AuthSession> {
        const user = await userRepository.findByUsername(username);
        const isValidPassword = user ? await bcrypt.compare(password, user.password_hash) : false;
        if (!user || !isValidPassword) throw new AppError(AUTH_MESSAGES.INVALID_CREDENTIALS, 401);

        await refreshTokenRepository.deleteExpiredForUser(user.id);

        // Cada login abre una sesión nueva; si ya hay el máximo, se cierra la más vieja.
        // Aquí empieza la jornada: su fin no cambia aunque la sesión se renueve.
        const refreshToken = generateRefreshToken();
        const sessionExpiresAt = getSessionDeadline();
        const refreshExpiresAt = getIdleExpiresAt(sessionExpiresAt);
        await refreshTokenRepository.createWithLimit(
            {
                userId: user.id,
                tokenHash: hashRefreshToken(refreshToken),
                expiresAt: refreshExpiresAt,
                sessionExpiresAt,
            },
            getMaxSessionsPerUser()
        );

        return {
            user: toAuthUser(user),
            accessToken: generateAccessToken({ userId: user.id, roleId: user.role_id }),
            refreshToken,
            refreshExpiresAt,
        };
    }

    async refresh(refreshToken: string | undefined): Promise<AuthSession> {
        if (!refreshToken) throw sessionExpired();

        const stored = await refreshTokenRepository.findByHash(hashRefreshToken(refreshToken));
        if (!stored) throw sessionExpired();

        // Sesión ya cerrada. Solo es sospechoso si se cerró por ROTACIÓN y no hace un instante:
        // alguien está usando un token viejo que ya se cambió → posible robo, se cierran todas.
        // (Cerrada por logout, límite de sesiones o seguridad = simplemente ya no sirve.)
        if (stored.revoked_at) {
            const wasRotated = stored.revoked_reason === RevokeReason.ROTATED;
            const isRecent = Date.now() - stored.revoked_at.getTime() < ROTATION_GRACE_MS;
            if (wasRotated && !isRecent) await refreshTokenRepository.revokeAllForUser(stored.user_id);
            throw sessionExpired();
        }

        // Vencida por inactividad o por fin de jornada (expires_at nunca pasa del fin de jornada)
        if (stored.expires_at <= new Date()) throw sessionExpired();

        if (!stored.user.is_active) {
            await refreshTokenRepository.revokeAllForUser(stored.user_id);
            throw sessionExpired();
        }

        // Rotación: el token recibido queda revocado y se entrega uno nuevo.
        // La inactividad vuelve a contar desde ahora; el fin de la jornada se hereda tal cual.
        const newRefreshToken = generateRefreshToken();
        const refreshExpiresAt = getIdleExpiresAt(stored.session_expires_at);
        const rotated = await refreshTokenRepository.rotate(stored.id, {
            userId: stored.user_id,
            tokenHash: hashRefreshToken(newRefreshToken),
            expiresAt: refreshExpiresAt,
            sessionExpiresAt: stored.session_expires_at,
        });
        if (!rotated) throw sessionExpired(); // otra petición lo rotó primero

        return {
            user: toAuthUser(stored.user),
            accessToken: generateAccessToken({ userId: stored.user.id, roleId: stored.user.role_id }),
            refreshToken: newRefreshToken,
            refreshExpiresAt,
        };
    }

    // Cierra solo la sesión de este dispositivo; sin cookie no hay nada que revocar
    async logout(refreshToken: string | undefined): Promise<void> {
        if (!refreshToken) return;
        await refreshTokenRepository.revokeByHash(hashRefreshToken(refreshToken));
    }
}

export const authService = new AuthService();