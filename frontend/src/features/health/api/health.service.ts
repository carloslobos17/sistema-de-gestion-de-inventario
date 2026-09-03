import { apiClient } from '../../../api/axiosConfig';
import type { HealthResponse } from '../../../models/health.model';

export const getHealthStatus = async (): Promise<HealthResponse> => {
    const response = await apiClient.get<HealthResponse>('/health');
    return response.data;
};