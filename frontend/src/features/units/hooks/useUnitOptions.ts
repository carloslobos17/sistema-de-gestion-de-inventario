// src/features/units/hooks/useUnitOptions.ts
// Unidades de medida para el <select> del formulario de productos.
// El catálogo no cambia, así que se pide UNA sola vez por sesión y se reutiliza (caché en memoria).
import { useEffect, useState } from 'react';
import * as unitsApi from '../api/units.service';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { UnitOfMeasure } from '../model/units.types';

// Compartido por todos los componentes que usen el hook (ej. crear y editar producto)
let cachedRequest: Promise<UnitOfMeasure[]> | null = null;

function loadUnitsOnce(): Promise<UnitOfMeasure[]> {
    if (!cachedRequest) {
        cachedRequest = unitsApi.fetchUnits().catch((error) => {
            cachedRequest = null; // si falla, el próximo intento vuelve a pedirlo
            throw error;
        });
    }
    return cachedRequest;
}

export function useUnitOptions() {
    const [units, setUnits] = useState<UnitOfMeasure[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        loadUnitsOnce()
            .then((data) => {
                if (isMounted) setUnits(data);
            })
            .catch((err) => {
                if (isMounted) setError(getErrorMessage(err, 'Error al cargar las unidades de medida'));
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return { units, isLoading, error };
}
