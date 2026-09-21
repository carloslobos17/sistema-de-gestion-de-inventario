import { isAxiosError } from "axios";

export function getErrorMessage(error: unknown, fallback: string): string {
    if (isAxiosError(error)) {
        if (!error.response) return "Error de conexión con el servidor";
        return error.response.data?.error ?? fallback;
    }
    return fallback;
}