import bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import type { CrearUsuarioInput } from './user.schema';
import type { Usuario } from './user.types';

export class UserService {
    private userRepository = new UserRepository();

    async listar() {
        return this.userRepository.findAll();
    }

    async crear(datos: CrearUsuarioInput): Promise<Usuario> {
        const yaExiste = await this.userRepository.existsByUsername(datos.nombre_usuario);
        if (yaExiste) {
            throw new Error('El nombre de usuario ya está en uso');
        }

        const { password, ...resto } = datos;
        const password_hash = await bcrypt.hash(password, 10);

        return this.userRepository.create({ ...resto, password_hash });
    }
}