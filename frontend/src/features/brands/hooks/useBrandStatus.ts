import { useState, useCallback } from 'react';
import type { ActionResult } from '../../../types/common';
import type { Brand } from '../model/brands.types';
import { deactivateBrand, updateBrand } from '../api/brands.service';
import { getErrorMessage } from '../../../utils/getErrorMessage';

export function useBrandStatus() {
    const [isSaving, setIsSaving] = useState(false);

    const toggleBrandStatus = useCallback(async (brand: Brand): Promise<ActionResult<Brand | void>> => {
        setIsSaving(true);
        try {
            let data;
            if (brand.is_active) {
                await deactivateBrand(brand.id);
            } else {
                data = await updateBrand(brand.id, { is_active: true });
            }
            return { ok: true, data };
        } catch (error) {
            const fallback = brand.is_active 
                ? "Error al intentar desactivar la marca" 
                : "Error al intentar reactivar la marca";
                
            return { ok: false, error: getErrorMessage(error, fallback) };
        } finally {
            setIsSaving(false);
        }
    }, []);

    return { toggleBrandStatus, isSaving };
}