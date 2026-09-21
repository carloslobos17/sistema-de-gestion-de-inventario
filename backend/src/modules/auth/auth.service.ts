// src/modules/auth/auth.service.ts
import bcrypt from 'bcrypt';
import { UserRepository } from '../usuarios/user.repository';
import { generateTokens } from '../../utils/jwt.util';
import { LoginInput } from './auth.schema';
import type { JwtPayload, LoginResult } from './auth.types';

export class AuthService {
    private userRepository = new UserRepository();

    async login(datos: LoginInput): Promise<LoginResult> {
        // 1. Buscar al usuario (solo activos)
        const usuario = await this.userRepository.findByUsername(datos.nombre_usuario);
        if (!usuario) {
            throw new Error('Credenciales inválidas');
        }

        // 2. Verificar la contraseña
        const passwordValida = await bcrypt.compare(datos.password, usuario.password_hash);
        if (!passwordValida) {
            throw new Error('Credenciales inválidas');
        }

        // 3. Generar los tokens
        const payload: JwtPayload = { usuarioId: usuario.id, rolId: usuario.rol_id };
        const { accessToken, refreshToken, refreshExpiresAt } = generateTokens(payload);

        // 4. Guardar el refresh token en MySQL
        await this.userRepository.saveRefreshToken(usuario.id, refreshToken, refreshExpiresAt);

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