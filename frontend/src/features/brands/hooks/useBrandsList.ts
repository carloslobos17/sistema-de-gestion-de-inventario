import { useCallback, useEffect, useRef, useState } from 'react';
import * as brandsApi from '../api/brands.service';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { PaginationMeta } from '../../../types/common';
import type { Brand, BrandFilters } from '../model/brands.types';

// onPageOutOfRange: se llama con la última página válida cuando la actual quedó vacía
// (ej. se desactivó la única marca de la página 3 → hay que ir a la 2)
export function useBrandsList(filters: BrandFilters, onPageOutOfRange?: (lastPage: number) => void) {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Evita que una respuesta vieja pise a una nueva (ej. al escribir rápido en el buscador)
    const requestIdRef = useRef(0);

    // Campos sueltos como dependencias: no recarga si solo cambia la referencia del objeto
    const { search, is_active, page } = filters;

    const loadBrands = useCallback(async () => {
        const requestId = ++requestIdRef.current;
        const isLatest = () => requestId === requestIdRef.current;

        setIsLoading(true);
        setError(null);
        try {
            const result = await brandsApi.fetchBrands({ search, is_active, page });
            if (isLatest()) {
                setBrands(result.data);
                setMeta(result.meta);
            }
        } catch (err) {
            if (isLatest()) setError(getErrorMessage(err, 'Error al cargar las marcas'));
        } finally {
            if (isLatest()) setIsLoading(false);
        }
    }, [search, is_active, page]);

    useEffect(() => {
        loadBrands();
    }, [loadBrands]);

    // La página pedida ya no existe (quedó vacía) → ir a la última que sí tiene datos
    useEffect(() => {
        if (!meta || !onPageOutOfRange) return;
        const lastPage = Math.max(meta.totalPages, 1);
        if (meta.page > lastPage) onPageOutOfRange(lastPage);
    }, [meta, onPageOutOfRange]);

    // Quita una marca de la tabla al instante (después se recarga para rellenar la página)
    const removeBrandFromList = useCallback((id: number) => {
        setBrands((prev) => prev.filter((brand) => brand.id !== id));
    }, []);

    // Reemplaza una marca editada sin recargar
    const replaceBrandInList = useCallback((updated: Brand) => {
        setBrands((prev) => prev.map((brand) => (brand.id === updated.id ? updated : brand)));
    }, []);

    return { brands, meta, isLoading, error, reload: loadBrands, removeBrandFromList, replaceBrandInList };
}
