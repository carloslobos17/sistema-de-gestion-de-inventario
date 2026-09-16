// src/repositories/user.repository.ts
import { prisma } from '../../config/db';
import { Usuario } from '@prisma/client';

export class UserRepository {
    // Buscar un usuario por su username para el login
    async findByUsername(nombre_usuario: string): Promise<Usuario | null> {
        return await prisma.usuario.findUnique({
            where: {
                nombre_usuario: nombre_usuario,
                activo: true // Solo permitimos login a usuarios activos
            },
            include: {
                rol: true // Incluye los datos del rol asociado
            }
        });
    }

    // Guardar o actualizar el refresh token del usuario
    async saveRefreshToken(usuarioId: number, token: string, expiresAt: Date) {
        return await prisma.refreshToken.upsert({
            where: { usuario_id: usuarioId },
            update: {
                token: token,
                fecha_expiracion: expiresAt,
                revocado: false
            },
            create: {
                usuario_id: usuarioId,
                token: token,
                fecha_expiracion: expiresAt,
                revocado: false
            }
        });
    }

    // Buscar un refresh token en la base de datos
    async findRefreshToken(token: string) {
        return await prisma.refreshToken.findUnique({
            where: { token }
        });
    }

    // Revocar un refresh token (para logout o cambio de turno)
    async revokeRefreshToken(token: string) {
        return await prisma.refreshToken.update({
            where: { token },
            data: { revocado: true }
        });
    }
}