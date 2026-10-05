// src/features/auth/api/auth.service.ts
// Único archivo que habla con el backend para autenticación.
import { apiClient } from '../../../api/axiosConfig';
import { toApiError } from '../../../api/apiError';
import type { LoginCredentials, LoginResponse } from '../auth.types';

export async function loginWithCredentials(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
        // Axios serializa automáticamente el body a JSON y maneja los headers
        const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw toApiError(error, 'No se pudo iniciar sesión');
    }
}