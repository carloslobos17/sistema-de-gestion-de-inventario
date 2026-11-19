// src/modules/auth/refresh-token.repository.ts
import { RevokeReason } from '@prisma/client';
import { prisma } from '../../config/db';
import type { NewSessionData } from './auth.types';

// Sesión abierta = sin revocar y sin vencer
function activeSessionsOf(userId: number) {
    return { user_id: userId, revoked_at: null, expires_at: { gt: new Date() } };
}

// Convierte los datos de la sesión al formato de la tabla
function toSessionRow(session: NewSessionData) {
    return {
        user_id: session.userId,
        token_hash: session.tokenHash,
        expires_at: session.expiresAt,
        session_expires_at: session.sessionExpiresAt,
    };
}

export class RefreshTokenRepository {
    // Crea la sesión nueva y, si el usuario ya llegó al máximo, cierra las más viejas.
    createWithLimit(session: NewSessionData, maxSessions: number): Promise<void> {
        return prisma.$transaction(async (tx) => {
            // Se quedan las (max - 1) más nuevas; la que llega completa el máximo
            const toClose = await tx.refreshToken.findMany({
                where: activeSessionsOf(session.userId),
                orderBy: [{ created_at: 'desc' }, { id: 'desc' }],
                skip: maxSessions - 1,
                select: { id: true },
            });

            if (toClose.length > 0) {
                await tx.refreshToken.updateMany({
                    where: { id: { in: toClose.map((session) => session.id) } },
                    data: { revoked_at: new Date(), revoked_reason: RevokeReason.SESSION_LIMIT },
                });
            }

            await tx.refreshToken.create({ data: toSessionRow(session) });
        });
    }

    // Trae la sesión con su usuario y rol: el refresh devuelve los permisos actuales.
    // El rol se aplana igual que en findByUsername: { role: 'Admin', can_manage_structure: true }
    async findByHash(tokenHash: string) {
        const row = await prisma.refreshToken.findUnique({
            where: { token_hash: tokenHash },
            include: {
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        role_id: true,
                        is_active: true,
                        role: { select: { name: true, can_manage_structure: true } },
                    },
                },
            },
        });
        if (!row) return null;

        const { role, ...user } = row.user;
        return { ...row, user: { ...user, role: role.name, can_manage_structure: role.can_manage_structure } };
    }

    // Revoca la sesión actual y crea la nueva en una sola transacción.
    // Devuelve false si otra petición ya la había rotado (dos pestañas a la vez).
    rotate(currentId: number, newSession: NewSessionData): Promise<boolean> {
        return prisma.$transaction(async (tx) => {
            const { count } = await tx.refreshToken.updateMany({
                where: { id: currentId, revoked_at: null },
                data: { revoked_at: new Date(), revoked_reason: RevokeReason.ROTATED },
            });
            if (count === 0) return false;

            await tx.refreshToken.create({ data: toSessionRow(newSession) });
            return true;
        });
    }

    // updateMany no falla si el token no existe: cerrar sesión dos veces no rompe nada
    revokeByHash(tokenHash: string) {
        return prisma.refreshToken.updateMany({
            where: { token_hash: tokenHash, revoked_at: null },
            data: { revoked_at: new Date(), revoked_reason: RevokeReason.LOGOUT },
        });
    }

    // Cierra todas las sesiones del usuario (robo detectado, usuario desactivado o contraseña cambiada)
    revokeAllForUser(userId: number) {
        return prisma.refreshToken.updateMany({
            where: { user_id: userId, revoked_at: null },
            data: { revoked_at: new Date(), revoked_reason: RevokeReason.SECURITY },
        });
    }

    // Limpieza: borra las sesiones vencidas del usuario para que la tabla no crezca sin límite
    deleteExpiredForUser(userId: number) {
        return prisma.refreshToken.deleteMany({
            where: { user_id: userId, expires_at: { lt: new Date() } },
        });
    }

    // Limpieza general: borra las sesiones vencidas de todos los usuarios
    deleteAllExpired() {
        return prisma.refreshToken.deleteMany({
            where: { expires_at: { lt: new Date() } },
        });
    }
}

export const refreshTokenRepository = new RefreshTokenRepository();