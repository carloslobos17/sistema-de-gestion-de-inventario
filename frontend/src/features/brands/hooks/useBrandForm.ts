// =====================================================================
// H2 · Crear y editar una marca — Integrante 2
// Archivo: features/brands/hooks/useBrandForm.ts
// ---------------------------------------------------------------------
// QUÉ HACE: estado del formulario de marca (lo que se escribe) y su validación.
// Devuelve { values, errors, handleChange, validate }.
// =====================================================================
import { useCallback, useState, type ChangeEvent } from 'react';
import { EMPTY_BRAND_FORM } from '../model/brands.constants';
import { brandFormSchema } from '../model/brands.validator';
import type { BrandFormErrors, BrandFormValues } from '../model/brands.types';

export function useBrandForm(initialValues: BrandFormValues = EMPTY_BRAND_FORM) {
    const [values, setValues] = useState<BrandFormValues>(initialValues);
    const [errors, setErrors] = useState<BrandFormErrors>({});

    // Actualiza el campo y borra su error (si tenía) mientras el usuario escribe
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const field = e.target.name as keyof BrandFormValues;
        const { value } = e.target;

        setValues((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    }, []);

    // Valida con Zod. true = se puede enviar; false = hay errores (ya quedan en `errors`)
    const validate = useCallback((): boolean => {
        const result = brandFormSchema.safeParse(values);

        if (!result.success) {
            const fieldErrors: BrandFormErrors = {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof BrandFormValues;
                if (!fieldErrors[field]) fieldErrors[field] = issue.message;
            });
            setErrors(fieldErrors);
            return false;
        }

        setErrors({});
        return true;
    }, [values]);

    return { values, errors, handleChange, validate };
}
