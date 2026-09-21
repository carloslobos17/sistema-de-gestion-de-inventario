export interface Usuario {
    id: number;
    rol_id: number;
    nombre_usuario: string;
    nombre: string;
    apellido: string;
    activo: boolean;
    fecha_creacion: Date;
}

// Solo para verificar credenciales en el login
export interface UsuarioConCredenciales extends Usuario {
    password_hash: string;
}

export interface RefreshTokenData {
    id: number;
    usuario_id: number;
    token: string;
    fecha_expiracion: Date;
    revocado: boolean;
}