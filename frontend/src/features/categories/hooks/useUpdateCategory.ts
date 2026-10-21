// src/features/categories/hooks/useUpdateCategory.ts
// Renombra una categoría. Si el nombre no cambió, devuelve la original sin llamar al backend.
import { useCallback, useState } from 'react';
import * as categoriesApi from '../api/categories.service';
import { toUpdateCategoryPayload } from '../model/categories.mappers';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { Category, CategoryActionResult, CategoryFormValues } from '../model/categories.types';

export function useUpdateCategory() {
    const [isSaving, setIsSaving] = useState(false);

    const updateCategory = useCallback(async (original: Category, values: CategoryFormValues): Promise<CategoryActionResult> => {
        const payload = toUpdateCategoryPayload(values, original);

        // Nada cambió: no hace falta llamar al backend
        if (Object.keys(payload).length === 0) {
            return { ok: true, data: original };
        }

        setIsSaving(true);
        try {
            const updated = await categoriesApi.updateCategory(original.id, payload);
            return { ok: true, data: updated };
        } catch (err) {
            return { ok: false, error: getErrorMessage(err, 'Error al actualizar la categoría') };
        } finally {
            setIsSaving(false);
        }
    }, []);

    return { updateCategory, isSaving };
}
