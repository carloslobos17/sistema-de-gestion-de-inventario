// src/services/auth.service.ts
import bcrypt from 'bcrypt';
import { UserRepository } from '../usuarios/user.repository';
import { generateTokens } from '../../utils/jwt.util';
import { LoginInput } from './auth.schema';

export class AuthService {
    private userRepository = new UserRepository();

    async login(datos: LoginInput) {
        // 1. Buscar al usuario
        const usuario = await this.userRepository.findByUsername(datos.nombre_usuario);
        if (!usuario) {
            throw new Error('Credenciales inválidas'); // Mensaje genérico por seguridad
        }

        // 2. Verificar la contraseña
        const passwordValida = await bcrypt.compare(datos.password, usuario.password_hash);
        if (!passwordValida) {
            throw new Error('Credenciales inválidas');
        }

        // 3. Generar los tokens
        const payload = { usuarioId: usuario.id, rolId: usuario.rol_id };
        const { accessToken, refreshToken } = generateTokens(payload);

        // 4. Calcular la fecha de expiración para la base de datos (30 minutos)
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

        // 5. Guardar el refresh token en MySQL
        await this.userRepository.saveRefreshToken(usuario.id, refreshToken, expiresAt);

        // 6. Retornar los datos limpios (sin el hash de la contraseña)
        return {
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                rol_id: usuario.rol_id
            },
            accessToken,
            refreshToken
        };
    }
}