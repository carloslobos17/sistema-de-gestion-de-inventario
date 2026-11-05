// src/features/customers/api/customers.service.ts
// Único archivo que habla con /api/customers. Ya está completo: los hooks solo lo llaman.
import { apiClient } from '../../../api/axiosConfig';
import { toApiError } from '../../../api/apiError';
import type { ApiResponse, PaginatedResponse } from '../../../api/api.types';
import { toCustomerQueryParams } from '../model/customers.mappers';
import type { CreateCustomerPayload, Customer, CustomerFilters, UpdateCustomerPayload } from '../model/customers.types';

// GET /api/customers?search=&is_active=&customer_type=&page=&limit= → { data, meta }
export async function fetchCustomers(filters: CustomerFilters = {}): Promise<PaginatedResponse<Customer>> {
    try {
        const response = await apiClient.get<PaginatedResponse<Customer>>('/customers', {
            params: toCustomerQueryParams(filters),
        });
        return response.data;
    } catch (error) {
        throw toApiError(error, 'No se pudieron cargar los clientes');
    }
}

// GET /api/customers/:id
export async function fetchCustomerById(id: number): Promise<Customer> {
    try {
        const response = await apiClient.get<ApiResponse<Customer>>(`/customers/${id}`);
        return response.data.data;
    } catch (error) {
        throw toApiError(error, 'No se pudo cargar el cliente');
    }
}

// POST /api/customers → 409 si el documento (tipo + número) o el NRC ya existen; 403 si un vendedor envía credit_limit
export async function createCustomer(payload: CreateCustomerPayload): Promise<Customer> {
    try {
        const response = await apiClient.post<ApiResponse<Customer>>('/customers', payload);
        return response.data.data;
    } catch (error) {
        throw toApiError(error, 'No se pudo crear el cliente');
    }
}

// PATCH /api/customers/:id → editar y/o reactivar ({ is_active: true }).
// credit_limit e is_active solo con can_manage_structure (si no, 403).
export async function updateCustomer(id: number, payload: UpdateCustomerPayload): Promise<Customer> {
    try {
        const response = await apiClient.patch<ApiResponse<Customer>>(`/customers/${id}`, payload);
        return response.data.data;
    } catch (error) {
        throw toApiError(error, 'No se pudo actualizar el cliente');
    }
}

// DELETE /api/customers/:id → borrado lógico (is_active = false). Solo can_manage_structure.
export async function deactivateCustomer(id: number): Promise<void> {
    try {
        await apiClient.delete(`/customers/${id}`);
    } catch (error) {
        throw toApiError(error, 'No se pudo desactivar el cliente');
    }
}
