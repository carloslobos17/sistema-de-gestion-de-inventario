// src/features/locations/hooks/useLocations.ts
// Departamentos, municipios y distritos para los selects en cascada (clientes, proveedores...).
// El catálogo no cambia: se pide UNA sola vez por sesión y se reutiliza (caché en memoria).
import { useCallback, useEffect, useState } from 'react';
import * as locationsApi from '../api/locations.service';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { Department, District, Municipality } from '../model/locations.types';

let cachedRequest: Promise<Department[]> | null = null;

function loadLocationsOnce(): Promise<Department[]> {
    if (!cachedRequest) {
        cachedRequest = locationsApi.fetchLocations().catch((error) => {
            cachedRequest = null; // si falla, el próximo intento vuelve a pedirlo
            throw error;
        });
    }
    return cachedRequest;
}

export function useLocations() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        loadLocationsOnce()
            .then((data) => {
                if (isMounted) setDepartments(data);
            })
            .catch((err) => {
                if (isMounted) setError(getErrorMessage(err, 'Error al cargar los departamentos y municipios'));
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    // Municipios del departamento elegido ([] si no hay departamento)
    const getMunicipalities = useCallback(
        (departmentCode: string | undefined): Municipality[] =>
            departments.find((department) => department.code === departmentCode)?.municipalities ?? [],
        [departments]
    );

    // Distritos del municipio elegido ([] si no hay municipio)
    const getDistricts = useCallback(
        (departmentCode: string | undefined, municipalityId: number | undefined): District[] =>
            getMunicipalities(departmentCode).find((municipality) => municipality.id === municipalityId)?.districts ?? [],
        [getMunicipalities]
    );

    return { departments, isLoading, error, getMunicipalities, getDistricts };
}
