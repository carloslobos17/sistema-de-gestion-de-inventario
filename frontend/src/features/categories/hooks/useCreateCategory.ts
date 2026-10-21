// src/features/categories/hooks/useCreateCategory.ts
// Crea una categoría. Devuelve ActionResult; NO muestra toasts ni cierra modales.
import { useCallback, useState } from 'react';
import * as categoriesApi from '../api/categories.service';
import { toCreateCategoryPayload } from '../model/categories.mappers';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { CategoryActionResult, CategoryFormValues } from '../model/categories.types';

export function useCreateCategory() {
    const [isSaving, setIsSaving] = useState(false);

    const createCategory = useCallback(async (values: CategoryFormValues): Promise<CategoryActionResult> => {
        setIsSaving(true);
        try {
            // El mapper limpia los espacios: "  Herramientas   eléctricas " → "Herramientas eléctricas"
            const created = await categoriesApi.createCategory(toCreateCategoryPayload(values));
            return { ok: true, data: created };
        } catch (err) {
            // 409 (nombre repetido) y 403 (sin permiso) traen el mensaje del backend
            return { ok: false, error: getErrorMessage(err, 'Error al crear la categoría') };
        } finally {
            setIsSaving(false);
        }
    }, []);

    return { createCategory, isSaving };
}
