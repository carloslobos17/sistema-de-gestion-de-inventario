// src/features/categories/api/categories.service.ts
// Único archivo que habla con /api/categories.
import { apiClient } from '../../../api/axiosConfig';
import { toApiError } from '../../../api/apiError';
import type { ApiResponse, PaginatedResponse } from '../../../api/api.types';
import { toCategoryQueryParams } from '../model/categories.mappers';
import type { Category, CategoryFilters, CreateCategoryPayload, UpdateCategoryPayload } from '../model/categories.types';

// GET /api/categories?search=&is_active=&page=&limit= → { data, meta }
export async function fetchCategories(filters: CategoryFilters = {}): Promise<PaginatedResponse<Category>> {
    try {
        const response = await apiClient.get<PaginatedResponse<Category>>('/categories', {
            params: toCategoryQueryParams(filters),
        });
        return response.data;
    } catch (error) {
        throw toApiError(error, 'No se pudieron cargar las categorías');
    }
}

// GET /api/categories/:id
export async function fetchCategoryById(id: number): Promise<Category> {
    try {
        const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
        return response.data.data;
    } catch (error) {
        throw toApiError(error, 'No se pudo cargar la categoría');
    }
}

// POST /api/categories → 409 si el nombre ya existe, 403 sin permiso
export async function createCategory(payload: CreateCategoryPayload): Promise<Category> {
    try {
        const response = await apiClient.post<ApiResponse<Category>>('/categories', payload);
        return response.data.data;
    } catch (error) {
        throw toApiError(error, 'No se pudo crear la categoría');
    }
}

// PATCH /api/categories/:id → renombrar y/o reactivar ({ is_active: true })
export async function updateCategory(id: number, payload: UpdateCategoryPayload): Promise<Category> {
    try {
        const response = await apiClient.patch<ApiResponse<Category>>(`/categories/${id}`, payload);
        return response.data.data;
    } catch (error) {
        throw toApiError(error, 'No se pudo actualizar la categoría');
    }
}

// DELETE /api/categories/:id → borrado lógico (is_active = false)
export async function deactivateCategory(id: number): Promise<void> {
    try {
        await apiClient.delete(`/categories/${id}`);
    } catch (error) {
        throw toApiError(error, 'No se pudo desactivar la categoría');
    }
}
