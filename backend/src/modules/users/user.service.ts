import bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import type { CreateUserInput } from './user.schema';
import type { User } from './user.types';

export class UserService {
    private userRepository = new UserRepository();

    async list() {
        return this.userRepository.findAll();
    }

    async create(data: CreateUserInput): Promise<User> {
        const alreadyExists = await this.userRepository.existsByUsername(data.username);
        if (alreadyExists) {
            throw new Error('El nombre de usuario ya está en uso');
        }

        const { password, ...rest } = data;
        const password_hash = await bcrypt.hash(password, 10);

        return this.userRepository.create({ ...rest, password_hash });
    }
}