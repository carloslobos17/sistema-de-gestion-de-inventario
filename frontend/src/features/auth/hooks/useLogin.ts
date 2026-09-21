import { loginWithCredentials } from "../api/auth.service";
import type { LoginCredentials } from "../auth.types.ts";

export function useLogin() {
    const login = async (credentials: LoginCredentials) => {
        const response = await loginWithCredentials(credentials);

        localStorage.setItem("token", response.datos.accessToken);
        localStorage.setItem("usuario", JSON.stringify(response.datos.usuario));

        return response;
    };

    return { login };
}