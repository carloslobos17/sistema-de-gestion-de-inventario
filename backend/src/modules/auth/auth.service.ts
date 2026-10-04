// src/modules/auth/auth.service.ts
import bcrypt from 'bcrypt';
import { UserRepository } from '../users/user.repository';
import { generateTokens } from '../../utils/jwt.util';
import { LoginInput } from './auth.schema';
import type { JwtPayload, LoginResult } from './auth.types';

export class AuthService {
    private userRepository = new UserRepository();

    async login(data: LoginInput): Promise<LoginResult> {
        // 1. Buscar al usuario (solo activos)
        const user = await this.userRepository.findByUsername(data.username);
        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        // 2. Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(data.password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error('Credenciales inválidas');
        }

        // 3. Generar los tokens
        const payload: JwtPayload = { userId: user.id, roleId: user.role_id };
        const { accessToken, refreshToken, refreshExpiresAt } = generateTokens(payload);

        // 4. Guardar el refresh token en MySQL
        await this.userRepository.saveRefreshToken(user.id, refreshToken, refreshExpiresAt);

        return {
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                role_id: user.role_id,
                role: user.role
            },
            accessToken,
            refreshToken
        };
    }
}
