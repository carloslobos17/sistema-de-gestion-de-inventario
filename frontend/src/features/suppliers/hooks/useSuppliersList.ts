// src/features/suppliers/hooks/useSuppliersList.ts
// Carga una página de proveedores y la recarga cuando cambian los filtros o la página.
import { useCallback, useEffect, useRef, useState } from 'react';
import * as suppliersApi from '../api/suppliers.service';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { PaginationMeta } from '../../../types/common';
import type { Supplier, SupplierFilters } from '../model/suppliers.types';

// onPageOutOfRange: se llama con la última página válida cuando la actual quedó vacía
// (ej. se desactivó el único proveedor de la página 3 → hay que ir a la 2)
export function useSuppliersList(filters: SupplierFilters, onPageOutOfRange?: (lastPage: number) => void) {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Evita que una respuesta vieja pise a una nueva (ej. al escribir rápido en el buscador)
    const requestIdRef = useRef(0);

    // Campos sueltos como dependencias: no recarga si solo cambia la referencia del objeto
    const { search, is_active, page } = filters;

    const loadSuppliers = useCallback(async () => {
        const requestId = ++requestIdRef.current;
        const isLatest = () => requestId === requestIdRef.current;

        setIsLoading(true);
        setError(null);
        try {
            const result = await suppliersApi.fetchSuppliers({ search, is_active, page });
            if (isLatest()) {
                setSuppliers(result.data);
                setMeta(result.meta);
            }
        } catch (err) {
            if (isLatest()) setError(getErrorMessage(err, 'Error al cargar los proveedores'));
        } finally {
            if (isLatest()) setIsLoading(false);
        }
    }, [search, is_active, page]);

    useEffect(() => {
        loadSuppliers();
    }, [loadSuppliers]);

    // La página pedida ya no existe (quedó vacía) → ir a la última que sí tiene datos
    useEffect(() => {
        if (!meta || !onPageOutOfRange) return;
        const lastPage = Math.max(meta.totalPages, 1);
        if (meta.page > lastPage) onPageOutOfRange(lastPage);
    }, [meta, onPageOutOfRange]);

    // Quita un proveedor de la tabla al instante (después se recarga para rellenar la página)
    const removeSupplierFromList = useCallback((id: number) => {
        setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
    }, []);

    return { suppliers, meta, isLoading, error, reload: loadSuppliers, removeSupplierFromList };
}