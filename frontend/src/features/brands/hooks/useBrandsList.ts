// =====================================================================
// H1 · Ver y buscar marcas — Integrante 1
// Archivo: features/brands/hooks/useBrandsList.ts
// ---------------------------------------------------------------------
// QUÉ HACE: carga las marcas desde el backend y las recarga cuando cambian los filtros.
//
// TAREAS:
//   [x] isLoading empieza en true y se apaga al terminar (en finally)
//   [x] Guardar el error con getErrorMessage(err, 'Error al cargar las marcas')
//       y devolver isLoading y error
//   [x] Evitar que una respuesta vieja pise a una nueva al escribir rápido
//       (patrón requestIdRef de useUsersList)
//   [x] Usar como dependencias los campos sueltos (search, is_active), no el objeto filters
//
// NO CAMBIAR: los nombres que devuelve (brands, reload, removeBrandFromList,
// replaceBrandInList). La página y H2/H3 dependen de ellos.
// REFERENCIA: features/users/hooks/useUsersList.ts
// =====================================================================
import { useCallback, useEffect, useRef, useState } from 'react';
import * as brandsApi from '../api/brands.service';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { Brand, BrandFilters } from '../model/brands.types';

export function useBrandsList(filters: BrandFilters) {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Evita que una respuesta vieja pise a una nueva (ej. al escribir rápido en el buscador)
    const requestIdRef = useRef(0);

    // Campos sueltos como dependencias: no recarga si solo cambia la referencia del objeto
    const { search, is_active } = filters;

    const loadBrands = useCallback(async () => {
        const requestId = ++requestIdRef.current;
        const isLatest = () => requestId === requestIdRef.current;

        setIsLoading(true);
        setError(null);
        try {
            const data = await brandsApi.fetchBrands({ search, is_active });
            if (isLatest()) setBrands(data);
        } catch (err) {
            if (isLatest()) setError(getErrorMessage(err, 'Error al cargar las marcas'));
        } finally {
            if (isLatest()) setIsLoading(false);
        }
    }, [search, is_active]);

    useEffect(() => {
        loadBrands();
    }, [loadBrands]);

    // Quita una marca de la tabla sin recargar (después de desactivarla o reactivarla)
    const removeBrandFromList = useCallback((id: number) => {
        setBrands((prev) => prev.filter((brand) => brand.id !== id));
    }, []);

    // Reemplaza una marca editada sin recargar
    const replaceBrandInList = useCallback((updated: Brand) => {
        setBrands((prev) => prev.map((brand) => (brand.id === updated.id ? updated : brand)));
    }, []);

    return { brands, isLoading, error, reload: loadBrands, removeBrandFromList, replaceBrandInList };
}