// src/api/apiError.ts
// Convierte cualquier error de una petición HTTP en un Error con un mensaje legible.
// Lo usan todos los servicios para que las páginas solo tengan que mostrar error.message.
import { isAxiosError } from 'axios';
import type { ApiErrorBody } from './api.types';

export function toApiError(error: unknown, fallback: string): Error {
    if (isAxiosError<ApiErrorBody>(error)) {
        // Sin respuesta = el backend no está disponible o no hay red
        if (!error.response) return new Error('Error de conexión con el servidor');

        // Si hay detalle de Zod se muestra ese, que es más específico
        const body = error.response.data;
        return new Error(body?.details?.[0]?.message ?? body?.error ?? fallback);
    }
    return new Error(fallback);
}
