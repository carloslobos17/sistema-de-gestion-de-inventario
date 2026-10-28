// src/features/economic-activities/hooks/useEconomicActivities.ts
// Actividades económicas para el selector con buscador (proveedores, clientes...).
// El catálogo no cambia: se pide UNA sola vez por sesión y se reutiliza (caché en memoria).
import { useEffect, useState } from 'react';
import * as economicActivitiesApi from '../api/economicActivities.service';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { EconomicActivity } from '../model/economicActivities.types';

let cachedRequest: Promise<EconomicActivity[]> | null = null;

function loadActivitiesOnce(): Promise<EconomicActivity[]> {
    if (!cachedRequest) {
        cachedRequest = economicActivitiesApi.fetchEconomicActivities().catch((error) => {
            cachedRequest = null; // si falla, el próximo intento vuelve a pedirlo
            throw error;
        });
    }
    return cachedRequest;
}

export function useEconomicActivities() {
    const [activities, setActivities] = useState<EconomicActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        loadActivitiesOnce()
            .then((data) => {
                if (isMounted) setActivities(data);
            })
            .catch((err) => {
                if (isMounted) setError(getErrorMessage(err, 'Error al cargar las actividades económicas'));
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return { activities, isLoading, error };
}
