import { loginWithCredentials } from "../api/auth.service";
import type { LoginCredentials } from "../../../types/auth.types";

export function useLogin() {

    const login = async (credentials: LoginCredentials) => {
        // 1. Hacemos la petición a través del servicio
        const response = await loginWithCredentials(credentials);

        // 2. Aquí prepararemos la sesión (Guardar en localStorage/Context)
        console.log("Tokens listos para guardar:", response.datos.accessToken);
        alert(`¡Bienvenido ${response.datos.usuario.nombre}! Login exitoso.`);

        return response;
    };

    return { login };
}