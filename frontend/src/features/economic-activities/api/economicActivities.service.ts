// src/features/economic-activities/api/economicActivities.service.ts
// Único archivo que habla con /api/economic-activities.
import { apiClient } from '../../../api/axiosConfig';
import { toApiError } from '../../../api/apiError';
import type { ApiResponse } from '../../../api/api.types';
import type { EconomicActivity } from '../model/economicActivities.types';

// GET /api/economic-activities → catálogo completo (773 actividades, ordenadas por nombre)
export async function fetchEconomicActivities(): Promise<EconomicActivity[]> {
    try {
        const response = await apiClient.get<ApiResponse<EconomicActivity[]>>('/economic-activities');
        return response.data.data;
    } catch (error) {
        throw toApiError(error, 'No se pudieron cargar las actividades económicas');
    }
}
