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
