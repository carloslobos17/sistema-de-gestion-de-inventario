// src/features/categories/hooks/useCategoriesList.ts
// Carga una página de categorías y la recarga cuando cambian los filtros o la página.
import { useCallback, useEffect, useRef, useState } from 'react';
import * as categoriesApi from '../api/categories.service';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { PaginationMeta } from '../../../types/common';
import type { Category, CategoryFilters } from '../model/categories.types';

// onPageOutOfRange: se llama con la última página válida cuando la actual quedó vacía
// (ej. se desactivó la única categoría de la página 3 → hay que ir a la 2)
export function useCategoriesList(filters: CategoryFilters, onPageOutOfRange?: (lastPage: number) => void) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Evita que una respuesta vieja pise a una nueva (ej. al escribir rápido en el buscador)
    const requestIdRef = useRef(0);

    // Campos sueltos como dependencias: no recarga si solo cambia la referencia del objeto
    const { search, is_active, page } = filters;

    const loadCategories = useCallback(async () => {
        const requestId = ++requestIdRef.current;
        const isLatest = () => requestId === requestIdRef.current;

        setIsLoading(true);
        setError(null);
        try {
            const result = await categoriesApi.fetchCategories({ search, is_active, page });
            if (isLatest()) {
                setCategories(result.data);
                setMeta(result.meta);
            }
        } catch (err) {
            if (isLatest()) setError(getErrorMessage(err, 'Error al cargar las categorías'));
        } finally {
            if (isLatest()) setIsLoading(false);
        }
    }, [search, is_active, page]);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    // La página pedida ya no existe (quedó vacía) → ir a la última que sí tiene datos
    useEffect(() => {
        if (!meta || !onPageOutOfRange) return;
        const lastPage = Math.max(meta.totalPages, 1);
        if (meta.page > lastPage) onPageOutOfRange(lastPage);
    }, [meta, onPageOutOfRange]);

    // Quita una categoría de la tabla al instante (después se recarga para rellenar la página)
    const removeCategoryFromList = useCallback((id: number) => {
        setCategories((prev) => prev.filter((category) => category.id !== id));
    }, []);

    // Reemplaza una categoría editada sin recargar
    const replaceCategoryInList = useCallback((updated: Category) => {
        setCategories((prev) => prev.map((category) => (category.id === updated.id ? updated : category)));
    }, []);

    return { categories, meta, isLoading, error, reload: loadCategories, removeCategoryFromList, replaceCategoryInList };
}