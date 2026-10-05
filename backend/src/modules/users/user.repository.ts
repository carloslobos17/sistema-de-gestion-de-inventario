// src/modules/users/user.repository.ts
import { prisma } from '../../config/db';
import type {
    UserWithCredentials,
    RefreshTokenData,
    UserListed,
    CreateUserData,
    UpdateUserData,
    UserFilters
} from './user.types';

// Tipo del "where" de Prisma para usuarios, sacado de tu propio cliente (no necesita importar Prisma)
type UserWhere = NonNullable<NonNullable<Parameters<typeof prisma.user.findMany>[0]>['where']>;

// Campos públicos del usuario (nunca incluye password_hash)
const USER_SELECT = {
    id: true,
    role_id: true,
    username: true,
    first_name: true,
    last_name: true,
    is_active: true,
    created_at: true
} as const;

// Los mismos campos + el nombre del rol
const USER_WITH_ROLE_SELECT = {
    ...USER_SELECT,
    role: { select: { name: true } }
} as const;

// Convierte { role: { name: 'Admin' } } en { role: 'Admin' }
function flattenRole<T extends { role: { name: string } }>(row: T) {
    const { role, ...user } = row;
    return { ...user, role: role.name };
}

export class UserRepository {
    // Buscar un usuario activo por su username para el login
    async findByUsername(username: string): Promise<UserWithCredentials | null> {
        const row = await prisma.user.findUnique({
            where: {
                username,
                is_active: true
            },
            select: {
                ...USER_WITH_ROLE_SELECT,
                password_hash: true
            }
        });

        return row ? flattenRole(row) : null;
    }

    async findById(id: number): Promise<UserListed | null> {
        const row = await prisma.user.findUnique({
            where: { id },
            select: USER_WITH_ROLE_SELECT
        });

        return row ? flattenRole(row) : null;
    }

    // excludeId permite ignorar al propio usuario al editar (puede "cambiar" a su mismo username)
    async existsByUsername(username: string, excludeId?: number): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: { username },
            select: { id: true }
        });
        return user !== null && user.id !== excludeId;
    }

    async create(data: CreateUserData): Promise<UserListed> {
        const row = await prisma.user.create({
            data,
            select: USER_WITH_ROLE_SELECT
        });

        return flattenRole(row);
    }

    async update(id: number, data: UpdateUserData): Promise<UserListed> {
        const row = await prisma.user.update({
            where: { id },
            data,
            select: USER_WITH_ROLE_SELECT
        });

        return flattenRole(row);
    }

    // Borrado lógico: desactiva al usuario y cierra todas sus sesiones en una sola transacción
    async deactivate(id: number): Promise<void> {
        await prisma.$transaction([
            prisma.user.update({
                where: { id },
                data: { is_active: false }
            }),
            prisma.refreshToken.updateMany({
                where: { user_id: id },
                data: { is_revoked: true }
            })
        ]);
    }

    async findAll(filters: UserFilters = {}): Promise<UserListed[]> {
        const where: UserWhere = {};

        // Activos / inactivos (si no se envía, trae todos)
        if (filters.is_active !== undefined) {
            where.is_active = filters.is_active;
        }

        // Por rol
        if (filters.role_id) {
            where.role_id = filters.role_id;
        }

        // Búsqueda por texto. Se separa por palabras para que "ana lopez" encuentre
        // a first_name "Ana" + last_name "López": cada palabra debe aparecer en algún campo.
        if (filters.search) {
            const words = filters.search.split(/\s+/).filter(Boolean);

            where.AND = words.map((word) => ({
                OR: [
                    { username: { contains: word } },
                    { first_name: { contains: word } },
                    { last_name: { contains: word } }
                ]
            }));
        }

        const rows = await prisma.user.findMany({
            where,
            select: USER_WITH_ROLE_SELECT,
            orderBy: { created_at: 'desc' }
        });

        return rows.map(flattenRole);
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

    // Revocar todas las sesiones de un usuario (al cambiarle la contraseña o desactivarlo)
    async revokeAllRefreshTokens(userId: number): Promise<void> {
        await prisma.refreshToken.updateMany({
            where: { user_id: userId },
            data: { is_revoked: true }
        });
    }
}