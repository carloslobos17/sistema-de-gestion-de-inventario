import type { User } from '../users/user.types';

export interface JwtPayload {
    userId: number;
    roleId: number;
}

export interface LoginResult {
    user: Pick<User, 'id' | 'first_name' | 'last_name' | 'role_id'> & { role: string };
    accessToken: string;
    refreshToken: string;
}