import bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { UserError } from './user.errors';
import type { CreateUserInput, UpdateUserInput } from './user.schema';
import type { UpdateUserData, UserListed, UserFilters } from './user.types';

const SALT_ROUNDS = 10;

export class UserService {
    private userRepository = new UserRepository();

    async list(filters: UserFilters = {}): Promise<UserListed[]> {
        return this.userRepository.findAll(filters);
    }

    async getById(id: number): Promise<UserListed> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new UserError('Usuario no encontrado', 404);
        }
        return user;
    }

    async create(data: CreateUserInput): Promise<UserListed> {
        const alreadyExists = await this.userRepository.existsByUsername(data.username);
        if (alreadyExists) {
            throw new UserError('El nombre de usuario ya está en uso', 409);
        }

        const { password, ...rest } = data;
        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

        return this.userRepository.create({ ...rest, password_hash });
    }

    async update(id: number, data: UpdateUserInput, currentUserId?: number): Promise<UserListed> {
        const user = await this.getById(id);

        // Evita que un admin se deje fuera a sí mismo
        if (currentUserId === id) {
            if (data.is_active === false) {
                throw new UserError('No puedes desactivar tu propio usuario', 400);
            }
            if (data.role_id !== undefined && data.role_id !== user.role_id) {
                throw new UserError('No puedes cambiar tu propio rol', 400);
            }
        }

        if (data.username && data.username !== user.username) {
            const taken = await this.userRepository.existsByUsername(data.username, id);
            if (taken) {
                throw new UserError('El nombre de usuario ya está en uso', 409);
            }
        }

        const { password, ...rest } = data;
        const updateData: UpdateUserData = { ...rest };

        if (password) {
            updateData.password_hash = await bcrypt.hash(password, SALT_ROUNDS);
        }

        const updated = await this.userRepository.update(id, updateData);

        // Si se cambió la contraseña o se desactivó, se cierran sus sesiones abiertas
        if (password || data.is_active === false) {
            await this.userRepository.revokeAllRefreshTokens(id);
        }

        return updated;
    }

    // Borrado lógico: el usuario queda inactivo (no puede iniciar sesión) pero se conserva
    // su historial. Se reactiva con PATCH { is_active: true }.
    async remove(id: number, currentUserId?: number): Promise<void> {
        if (currentUserId === id) {
            throw new UserError('No puedes eliminar tu propio usuario', 400);
        }

        await this.getById(id); // lanza 404 si no existe
        await this.userRepository.deactivate(id);
    }
}