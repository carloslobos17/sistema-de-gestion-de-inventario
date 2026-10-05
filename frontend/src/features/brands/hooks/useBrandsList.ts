// =====================================================================
// H1 · Ver y buscar marcas — Integrante 1
// Archivo: features/brands/hooks/useBrandsList.ts
// ---------------------------------------------------------------------
// QUÉ HACE: carga las marcas desde el backend y las recarga cuando cambian los filtros.
//
// ESTADO ACTUAL: versión MÍNIMA TEMPORAL para que H2 y H3 puedan probar desde el
// primer día. Funciona, pero le falta lo de abajo.
//
// TAREAS:
//   [ ] isLoading empieza en true y se apaga al terminar (en finally)
//   [ ] Guardar el error con getErrorMessage(err, 'Error al cargar las marcas')
//       (src/utils/getErrorMessage.ts) y devolver isLoading y error
//   [ ] Evitar que una respuesta vieja pise a una nueva al escribir rápido
//       (patrón requestIdRef de useUsersList)
//   [ ] Usar como dependencias los campos sueltos (search, is_active), no el objeto filters
//
// NO CAMBIAR: los nombres que devuelve (brands, reload, removeBrandFromList,
// replaceBrandInList). La página y H2/H3 dependen de ellos.
// REFERENCIA: features/users/hooks/useUsersList.ts
// =====================================================================
import { useCallback, useEffect, useState } from 'react';
import * as brandsApi from '../api/brands.service';
import type { Brand, BrandFilters } from '../model/brands.types';

export function useBrandsList(filters: BrandFilters) {
    const [brands, setBrands] = useState<Brand[]>([]);

    // TEMPORAL: sin loading, sin manejo de errores y sin control de respuestas viejas
    const loadBrands = useCallback(async () => {
        const data = await brandsApi.fetchBrands(filters);
        setBrands(data);
    }, [filters]);

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

    return { brands, reload: loadBrands, removeBrandFromList, replaceBrandInList };
}
