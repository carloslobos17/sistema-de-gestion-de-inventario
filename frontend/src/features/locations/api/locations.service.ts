// src/features/locations/api/locations.service.ts
// Único archivo que habla con /api/locations.
import { apiClient } from '../../../api/axiosConfig';
import { toApiError } from '../../../api/apiError';
import type { ApiResponse } from '../../../api/api.types';
import type { Department } from '../model/locations.types';

// GET /api/locations → árbol completo de departamentos, municipios y distritos
export async function fetchLocations(): Promise<Department[]> {
    try {
        const response = await apiClient.get<ApiResponse<Department[]>>('/locations');
        return response.data.data;
    } catch (error) {
        throw toApiError(error, 'No se pudieron cargar los departamentos y municipios');
    }
}
