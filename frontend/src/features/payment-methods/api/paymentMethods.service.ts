// src/features/payment-methods/api/paymentMethods.service.ts
// Único archivo que habla con /api/payment-methods.
import { apiClient } from '../../../api/axiosConfig';
import { toApiError } from '../../../api/apiError';
import type { ApiResponse } from '../../../api/api.types';
import type { PaymentMethod } from '../model/paymentMethods.types';

// GET /api/payment-methods → los 12 códigos de CAT-017, ordenados por código
export async function fetchPaymentMethods(): Promise<PaymentMethod[]> {
    try {
        const response = await apiClient.get<ApiResponse<PaymentMethod[]>>('/payment-methods');
        return response.data.data;
    } catch (error) {
        throw toApiError(error, 'No se pudieron cargar las formas de pago');
    }
}
