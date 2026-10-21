// src/features/categories/hooks/useCategoryForm.ts
// Estado del formulario de categoría y su validación con Zod.
import { useCallback, useState, type ChangeEvent } from 'react';
import { EMPTY_CATEGORY_FORM } from '../model/categories.constants';
import { categoryFormSchema } from '../model/categories.validator';
import type { CategoryFormErrors, CategoryFormValues } from '../model/categories.types';

export function useCategoryForm(initialValues: CategoryFormValues = EMPTY_CATEGORY_FORM) {
    const [values, setValues] = useState<CategoryFormValues>(initialValues);
    const [errors, setErrors] = useState<CategoryFormErrors>({});

    // Actualiza el campo y borra su error (si tenía) mientras el usuario escribe
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const field = e.target.name as keyof CategoryFormValues;
        const { value } = e.target;

        setValues((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    }, []);

    // Valida con Zod. true = se puede enviar; false = hay errores (ya quedan en `errors`)
    const validate = useCallback((): boolean => {
        const result = categoryFormSchema.safeParse(values);

        if (!result.success) {
            const fieldErrors: CategoryFormErrors = {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof CategoryFormValues;
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
