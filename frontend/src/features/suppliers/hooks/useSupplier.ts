// src/features/suppliers/hooks/useSupplier.ts
// Carga un solo proveedor por ID (para precargar el formulario de edición).
import { useEffect, useState } from 'react';
import * as suppliersApi from '../api/suppliers.service';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { Supplier } from '../model/suppliers.types';

export function useSupplier(id: number) {
    const isValidId = Number.isInteger(id) && id > 0;

    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [isLoading, setIsLoading] = useState(isValidId);
    const [error, setError] = useState<string | null>(isValidId ? null : 'El ID del proveedor no es válido.');

    useEffect(() => {
        if (!isValidId) return;

        // Si el componente se desmonta o cambia el ID antes de que responda, se ignora la respuesta
        let cancelled = false;

        setIsLoading(true);
        setError(null);

        suppliersApi
            .fetchSupplierById(id)
            .then((data) => {
                if (!cancelled) setSupplier(data);
            })
            .catch((err) => {
                if (!cancelled) setError(getErrorMessage(err, 'Error al cargar el proveedor'));
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [id, isValidId]);

    return { supplier, isLoading, error };
}
