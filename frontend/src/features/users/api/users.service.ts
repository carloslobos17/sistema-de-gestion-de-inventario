// src/features/users/api/users.service.ts
// El mensajero: único archivo que habla con el backend para usuarios.
// Funciones puras: reciben datos, hacen la petición y devuelven el resultado (o lanzan un Error legible).
import { apiClient } from '../../../api/axiosConfig';
import { toApiError } from '../../../api/apiError';
import type { ApiResponse } from '../../../api/api.types';
import type { CreateUserPayload, UpdateUserPayload, UserFilters, UserItem } from '../model/users.types';

// Filtros → query string de GET /api/users (omite los vacíos)
function toQueryParams(filters: UserFilters): Record<string, string> {
    const params: Record<string, string> = {};

    if (filters.search?.trim()) params.search = filters.search.trim();
    if (filters.role_id) params.role_id = String(filters.role_id);
    if (filters.is_active !== undefined) params.is_active = String(filters.is_active);

    return params;
}

export async function fetchUsers(filters: UserFilters = {}): Promise<UserItem[]> {
    try {
        const response = await apiClient.get<ApiResponse<UserItem[]>>('/users', {
            params: toQueryParams(filters),
        });
        return response.data.data;
    } catch (error) {
        throw toApiError(error, 'No se pudieron cargar los usuarios');
    }
}

export async function fetchUserById(id: number): Promise<UserItem> {
    try {
        const response = await apiClient.get<ApiResponse<UserItem>>(`/users/${id}`);
        return response.data.data;
    } catch (error) {
        throw toApiError(error, 'No se pudo cargar el usuario');
    }
}

export async function createUser(payload: CreateUserPayload): Promise<UserItem> {
    try {
        const response = await apiClient.post<ApiResponse<UserItem>>('/users', payload);
        return response.data.data;
    } catch (error) {
        throw toApiError(error, 'No se pudo crear el usuario');
    }
}

export async function updateUser(id: number, payload: UpdateUserPayload): Promise<UserItem> {
    try {
        const response = await apiClient.patch<ApiResponse<UserItem>>(`/users/${id}`, payload);
        return response.data.data;
    } catch (error) {
        throw toApiError(error, 'No se pudo actualizar el usuario');
    }
}

// Borrado lógico (el backend pone is_active = false)
export async function deactivateUser(id: number): Promise<void> {
    try {
        await apiClient.delete(`/users/${id}`);
    } catch (error) {
        throw toApiError(error, 'No se pudo desactivar el usuario');
    }
}
