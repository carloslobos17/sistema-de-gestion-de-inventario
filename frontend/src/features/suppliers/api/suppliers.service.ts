// src/features/suppliers/api/suppliers.service.ts
// Único archivo que habla con /api/suppliers.
import { apiClient } from '../../../api/axiosConfig';
import { toApiError } from '../../../api/apiError';
import type { ApiResponse, PaginatedResponse } from '../../../api/api.types';
import { toSupplierQueryParams } from '../model/suppliers.mappers';
import type { CreateSupplierPayload, Supplier, SupplierFilters, UpdateSupplierPayload } from '../model/suppliers.types';

// GET /api/suppliers?search=&is_active=&page=&limit= → { data, meta }
export async function fetchSuppliers(filters: SupplierFilters = {}): Promise<PaginatedResponse<Supplier>> {
    try {
        const response = await apiClient.get<PaginatedResponse<Supplier>>('/suppliers', {
            params: toSupplierQueryParams(filters),
        });
        return response.data;
    } catch (error) {
        throw toApiError(error, 'No se pudieron cargar los proveedores');
    }
}

// GET /api/suppliers/:id
export async function fetchSupplierById(id: number): Promise<Supplier> {
    try {
        const response = await apiClient.get<ApiResponse<Supplier>>(`/suppliers/${id}`);
        return response.data.data;
    } catch (error) {
        throw toApiError(error, 'No se pudo cargar el proveedor');
    }
}

// POST /api/suppliers → 409 si el nombre, NIT, NRC, teléfono o correo ya existen; 403 sin permiso
export async function createSupplier(payload: CreateSupplierPayload): Promise<Supplier> {
    try {
        const response = await apiClient.post<ApiResponse<Supplier>>('/suppliers', payload);
        return response.data.data;
    } catch (error) {
        throw toApiError(error, 'No se pudo crear el proveedor');
    }
}

// PATCH /api/suppliers/:id → editar y/o reactivar ({ is_active: true })
export async function updateSupplier(id: number, payload: UpdateSupplierPayload): Promise<Supplier> {
    try {
        const response = await apiClient.patch<ApiResponse<Supplier>>(`/suppliers/${id}`, payload);
        return response.data.data;
    } catch (error) {
        throw toApiError(error, 'No se pudo actualizar el proveedor');
    }
}

// DELETE /api/suppliers/:id → borrado lógico (is_active = false)
export async function deactivateSupplier(id: number): Promise<void> {
    try {
        await apiClient.delete(`/suppliers/${id}`);
    } catch (error) {
        throw toApiError(error, 'No se pudo desactivar el proveedor');
    }
}
