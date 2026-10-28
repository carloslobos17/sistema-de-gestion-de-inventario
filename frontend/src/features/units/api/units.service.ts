import { apiClient } from '../../../api/axiosConfig';
import { toApiError } from '../../../api/apiError';
import type { ApiResponse } from '../../../api/api.types';
import type { UnitOfMeasure } from '../model/units.types';

// GET /api/units → catálogo completo (40 unidades, ordenadas por nombre)
export async function fetchUnits(): Promise<UnitOfMeasure[]> {
    try {
        const response = await apiClient.get<ApiResponse<UnitOfMeasure[]>>('/units');
        return response.data.data;
    } catch (error) {
        throw toApiError(error, 'No se pudieron cargar las unidades de medida');
    }
}
