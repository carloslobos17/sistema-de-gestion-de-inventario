// src/repositories/user.repository.ts
import { prisma } from '../../config/db';
import type { UsuarioConCredenciales, RefreshTokenData } from './user.types';

export class UserRepository {
    // Buscar un usuario activo por su username para el login
    async findByUsername(nombre_usuario: string): Promise<UsuarioConCredenciales | null> {
        return prisma.usuario.findUnique({
            where: {
                nombre_usuario,
                activo: true // Solo permitimos login a usuarios activos
            },
            select: {
                id: true,
                rol_id: true,
                nombre_usuario: true,
                nombre: true,
                apellido: true,
                activo: true,
                fecha_creacion: true,
                password_hash: true
            }
        });
    }

    // Guardar o actualizar el refresh token del usuario
    async saveRefreshToken(usuarioId: number, token: string, expiresAt: Date): Promise<void> {
        await prisma.refreshToken.upsert({
            where: { usuario_id: usuarioId },
            update: {
                token,
                fecha_expiracion: expiresAt,
                revocado: false
            },
            create: {
                usuario_id: usuarioId,
                token,
                fecha_expiracion: expiresAt,
                revocado: false
            }
        });
    }


    // Buscar un refresh token en la base de datos
    async findRefreshToken(token: string): Promise<RefreshTokenData | null> {
        return prisma.refreshToken.findUnique({
            where: { token }
        });
    }

    // Revocar un refresh token (para logout o cambio de turno)
    async revokeRefreshToken(token: string): Promise<void> {
        await prisma.refreshToken.update({
            where: { token },
            data: { revocado: true }
        });
    }
}