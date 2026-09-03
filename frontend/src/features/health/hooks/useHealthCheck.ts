import { useState } from 'react';
import { getHealthStatus } from '../api/health.service';
// Importamos el tipo desde la nueva carpeta de modelos
import type { HealthResponse } from '../../../models/health.model';

export const useHealthCheck = () => {
    const [data, setData] = useState<HealthResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const testConnection = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getHealthStatus();
            setData(result);
        } catch (err) {
            setError('Error de conexión. Verifica que el servidor de Express esté ejecutándose.');
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, testConnection };
};