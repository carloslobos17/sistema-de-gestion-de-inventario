// src/features/brands/api/brands.service.ts
// [H0 · BASE] Único archivo que habla con /api/brands. Ya está completo: los hooks solo lo llaman.
import { apiClient } from '../../../api/axiosConfig';
import { toApiError } from '../../../api/apiError';
import type { ApiResponse } from '../../../api/api.types';
import { toBrandQueryParams } from '../model/brands.mappers';
import type { Brand, BrandFilters, CreateBrandPayload, UpdateBrandPayload } from '../model/brands.types';

// GET /api/brands?search=&is_active=
export async function fetchBrands(filters: BrandFilters = {}): Promise<Brand[]> {
    try {
        const response = await apiClient.get<ApiResponse<Brand[]>>('/brands', {
            params: toBrandQueryParams(filters),
        });
        return response.data.data;
    } catch (error) {
        throw toApiError(error, 'No se pudieron cargar las marcas');
    }
}

// GET /api/brands/:id
export async function fetchBrandById(id: number): Promise<Brand> {
    try {
        const response = await apiClient.get<ApiResponse<Brand>>(`/brands/${id}`);
        return response.data.data;
    } catch (error) {
        throw toApiError(error, 'No se pudo cargar la marca');
    }
}

// POST /api/brands → 409 si el nombre ya existe, 403 sin permiso
export async function createBrand(payload: CreateBrandPayload): Promise<Brand> {
    try {
        const response = await apiClient.post<ApiResponse<Brand>>('/brands', payload);
        return response.data.data;
    } catch (error) {
        throw toApiError(error, 'No se pudo crear la marca');
    }
}

// PATCH /api/brands/:id → renombrar y/o reactivar ({ is_active: true })
export async function updateBrand(id: number, payload: UpdateBrandPayload): Promise<Brand> {
    try {
        const response = await apiClient.patch<ApiResponse<Brand>>(`/brands/${id}`, payload);
        return response.data.data;
    } catch (error) {
        throw toApiError(error, 'No se pudo actualizar la marca');
    }
}

// DELETE /api/brands/:id → borrado lógico (is_active = false)
export async function deactivateBrand(id: number): Promise<void> {
    try {
        await apiClient.delete(`/brands/${id}`);
    } catch (error) {
        throw toApiError(error, 'No se pudo desactivar la marca');
    }
}
