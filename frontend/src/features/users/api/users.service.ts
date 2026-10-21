// src/features/users/api/users.service.ts
// El mensajero: único archivo que habla con el backend para usuarios.
// Funciones puras: reciben datos, hacen la petición y devuelven el resultado (o lanzan un Error legible).
import { apiClient } from '../../../api/axiosConfig';
import { toApiError } from '../../../api/apiError';
import type { ApiResponse, PaginatedResponse } from '../../../api/api.types';
import { toUserQueryParams } from '../model/users.mappers';
import type { CreateUserPayload, UpdateUserPayload, UserFilters, UserItem } from '../model/users.types';

// GET /api/users?search=&role_id=&is_active=&page=&limit= → { data, meta }
export async function fetchUsers(filters: UserFilters = {}): Promise<PaginatedResponse<UserItem>> {
    try {
        const response = await apiClient.get<PaginatedResponse<UserItem>>('/users', {
            params: toUserQueryParams(filters),
        });
        return response.data;
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
