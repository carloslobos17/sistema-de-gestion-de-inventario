// src/modules/auth/auth.types.ts
import type { User } from '../users/user.types';

export interface JwtPayload {
    userId: number;
    roleId: number;
}

export interface LoginResult {
    user: Pick<User, 'id' | 'first_name' | 'last_name' | 'role_id'> & {
        role: string;
        can_manage_structure: boolean;
    };
    accessToken: string;
    refreshToken: string;
}