// src/features/categories/hooks/useCategoryStatus.ts
// Desactiva (borrado lógico) o reactiva una categoría. Devuelve ActionResult; NO muestra toasts.
import { useCallback, useState } from 'react';
import * as categoriesApi from '../api/categories.service';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { ActionResult } from '../../../types/common';
import type { Category } from '../model/categories.types';

export function useCategoryStatus() {
    const [isSaving, setIsSaving] = useState(false);

    // Activa → DELETE /api/categories/:id · Inactiva → PATCH { is_active: true }
    const toggleCategoryStatus = useCallback(async (category: Category): Promise<ActionResult<Category | void>> => {
        setIsSaving(true);
        try {
            const data = category.is_active
                ? await categoriesApi.deactivateCategory(category.id)
                : await categoriesApi.updateCategory(category.id, { is_active: true });
            return { ok: true, data };
        } catch (err) {
            const fallback = category.is_active
                ? 'Error al desactivar la categoría'
                : 'Error al reactivar la categoría';
            return { ok: false, error: getErrorMessage(err, fallback) };
        } finally {
            setIsSaving(false);
        }
    }, []);

    return { toggleCategoryStatus, isSaving };
}
