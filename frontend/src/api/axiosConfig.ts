// src/api/axiosConfig.ts
// Cliente HTTP de toda la app. Pone el access token en cada petición y, si el backend responde 401,
// renueva la sesión UNA sola vez (aunque fallen varias peticiones a la vez) y las repite.
import axios, { isAxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_URL, REQUEST_TIMEOUT_MS } from './api.config';
import { authSession } from '../features/auth/session/authSession';
import { refreshSession } from '../features/auth/session/sessionManager';

// Marca para no repetir dos veces la misma petición
interface RetriableRequest extends InternalAxiosRequestConfig {
    _retried?: boolean;
}

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: REQUEST_TIMEOUT_MS,
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const { accessToken } = authSession.getState();
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
        if (!isAxiosError(error) || error.response?.status !== 401 || !error.config) {
            return Promise.reject(error);
        }

        const request = error.config as RetriableRequest;
        if (request._retried) return Promise.reject(error); // ya se renovó y aun así 401: no se insiste
        request._retried = true;

        // Si la renovación falla, la sesión queda cerrada y ProtectedRoute lleva al login
        const newToken = await refreshSession();
        if (!newToken) return Promise.reject(error);

        request.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(request);
    }
);
