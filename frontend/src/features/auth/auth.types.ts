export interface LoginCredentials {
    nombre_usuario: string;
    password: string;
}

export interface LoginFormErrors {
    nombre_usuario?: string;
    password?: string;
    general?: string;
}

export interface LoginResponse {
    mensaje: string;
    datos: {
        usuario: { id: number; nombre: string; apellido: string; rol_id: number; rol: string };
        accessToken: string;
        refreshToken: string;
    };
}