import type { Usuario } from '../usuarios/user.types';

export interface JwtPayload {
    usuarioId: number;
    rolId: number;
}

export interface LoginResult {
    usuario: Pick<Usuario, 'id' | 'nombre' | 'apellido' | 'rol_id'> & { rol: string };
    accessToken: string;
    refreshToken: string;
}