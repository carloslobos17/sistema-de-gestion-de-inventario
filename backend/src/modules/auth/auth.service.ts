// src/modules/auth/auth.service.ts
import bcrypt from 'bcrypt';
import { UserRepository } from '../users/user.repository';
import { generateTokens } from '../../utils/jwt.util';
import { AppError } from '../../utils/AppError';
import type { LoginInput } from './auth.schema';
import type { JwtPayload, LoginResult } from './auth.types';

// Mismo mensaje si el usuario no existe o la contraseña está mal: así no se revela qué usuarios existen.
const INVALID_CREDENTIALS = 'Credenciales inválidas';

export class AuthService {
    private userRepository = new UserRepository();

    async login(data: LoginInput): Promise<LoginResult> {
        // 1. Buscar al usuario (solo activos)
        const user = await this.userRepository.findByUsername(data.username);
        if (!user) {
            throw new AppError(INVALID_CREDENTIALS, 401);
        }

        // 2. Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(data.password, user.password_hash);
        if (!isPasswordValid) {
            throw new AppError(INVALID_CREDENTIALS, 401);
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
                role: user.role,
                can_manage_structure: user.can_manage_structure // el frontend lo usa para mostrar u ocultar botones
            },
            accessToken,
            refreshToken
        };
    }
}
