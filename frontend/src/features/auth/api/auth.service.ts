import { isAxiosError } from "axios";
import { apiClient } from "../../../api/axiosConfig";
import type { LoginCredentials, LoginResponse } from "../auth.types.ts";

export async function loginWithCredentials(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
        // Axios serializa automáticamente el body a JSON y maneja los headers
        const response = await apiClient.post<LoginResponse>('/auth/login', credentials);

        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error ?? "No se pudo iniciar sesión");
        }
        throw new Error("Error de conexión con el servidor");
    }
}