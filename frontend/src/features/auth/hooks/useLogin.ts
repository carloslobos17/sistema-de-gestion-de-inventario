import { loginWithCredentials } from "../api/auth.service";
import type { LoginCredentials } from "../auth.types.ts";

export function useLogin() {
    const login = async (credentials: LoginCredentials) => {
        const response = await loginWithCredentials(credentials);

        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        return response;
    };

    return { login };
}