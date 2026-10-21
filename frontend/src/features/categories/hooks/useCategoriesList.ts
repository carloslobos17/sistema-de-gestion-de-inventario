// src/features/categories/hooks/useCategoriesList.ts
// Carga las categorías y las recarga cuando cambian los filtros.
import { useCallback, useEffect, useRef, useState } from 'react';
import * as categoriesApi from '../api/categories.service';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { Category, CategoryFilters } from '../model/categories.types';

export function useCategoriesList(filters: CategoryFilters) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Evita que una respuesta vieja pise a una nueva (ej. al escribir rápido en el buscador)
    const requestIdRef = useRef(0);

    // Campos sueltos como dependencias: no recarga si solo cambia la referencia del objeto
    const { search, is_active } = filters;

    const loadCategories = useCallback(async () => {
        const requestId = ++requestIdRef.current;
        const isLatest = () => requestId === requestIdRef.current;

        setIsLoading(true);
        setError(null);
        try {
            const data = await categoriesApi.fetchCategories({ search, is_active });
            if (isLatest()) setCategories(data);
        } catch (err) {
            if (isLatest()) setError(getErrorMessage(err, 'Error al cargar las categorías'));
        } finally {
            if (isLatest()) setIsLoading(false);
        }
    }, [search, is_active]);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    // Quita una categoría de la tabla sin recargar (después de desactivarla o reactivarla)
    const removeCategoryFromList = useCallback((id: number) => {
        setCategories((prev) => prev.filter((category) => category.id !== id));
    }, []);

    // Reemplaza una categoría editada sin recargar
    const replaceCategoryInList = useCallback((updated: Category) => {
        setCategories((prev) => prev.map((category) => (category.id === updated.id ? updated : category)));
    }, []);

    return { categories, isLoading, error, reload: loadCategories, removeCategoryFromList, replaceCategoryInList };
}