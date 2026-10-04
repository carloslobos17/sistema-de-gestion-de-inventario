// src/repositories/user.repository.ts
import { prisma } from '../../config/db';
import type { UserWithCredentials, RefreshTokenData, UserListed, CreateUserData, User } from './user.types';

export class UserRepository {
    // Buscar un usuario activo por su username para el login
    async findByUsername(username: string): Promise<UserWithCredentials | null> {
        const row = await prisma.user.findUnique({
            where: {
                username,
                is_active: true
            },
            select: {
                id: true,
                role_id: true,
                username: true,
                first_name: true,
                last_name: true,
                is_active: true,
                created_at: true,
                password_hash: true,
                role: { select: { name: true } }
            }
        });

        if (!row) return null;

        const { role, ...user } = row;
        return { ...user, role: role.name };
    }

    async existsByUsername(username: string): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: { username },
            select: { id: true }
        });
        return user !== null;
    }

    async create(data: CreateUserData): Promise<User> {
        return prisma.user.create({
            data,
            select: {
                id: true,
                role_id: true,
                username: true,
                first_name: true,
                last_name: true,
                is_active: true,
                created_at: true
            }
        })
    }


    // Guardar o actualizar el refresh token del usuario
    async saveRefreshToken(userId: number, token: string, expiresAt: Date): Promise<void> {
        await prisma.refreshToken.upsert({
            where: { user_id: userId },
            update: {
                token,
                expires_at: expiresAt,
                is_revoked: false
            },
            create: {
                user_id: userId,
                token,
                expires_at: expiresAt,
                is_revoked: false
            }
        });
    }

    async findAll(): Promise<UserListed[]> {
        const rows = await prisma.user.findMany({
            select: {
                id: true,
                role_id: true,
                username: true,
                first_name: true,
                last_name: true,
                is_active: true,
                created_at: true,
                role: { select: { name: true } }
            },
            orderBy: { created_at: 'desc' }
        });

        // Aplanamos rol.nombre a un string
        return rows.map(({ role, ...user }) => ({ ...user, role: role.name }));
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
            data: { is_revoked: true }
        });
    }
}