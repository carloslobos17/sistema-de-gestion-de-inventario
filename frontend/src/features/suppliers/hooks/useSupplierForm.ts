// src/features/suppliers/hooks/useSupplierForm.ts
// Estado del formulario de proveedor y su validación.
import { useCallback, useState, type ChangeEvent } from 'react';
import { ALLOWED_DOCUMENT_TYPES, EMPTY_SUPPLIER_FORM } from '../model/suppliers.constants';
import { validateSupplierForm } from '../model/suppliers.validator';
import type { SupplierFormErrors, SupplierFormValues, SupplierType } from '../model/suppliers.types';

export function useSupplierForm(initialValues: SupplierFormValues = EMPTY_SUPPLIER_FORM) {
    const [values, setValues] = useState<SupplierFormValues>(initialValues);
    const [errors, setErrors] = useState<SupplierFormErrors>({});

    // Cambia un campo y borra su error (para los componentes que no son <input>: ubicación, actividad, documento)
    const setField = useCallback(<K extends keyof SupplierFormValues>(field: K, value: SupplierFormValues[K]) => {
        setValues((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    }, []);

    // Para <input>, <textarea> y casillas: usa el atributo name como nombre del campo
    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const field = e.target.name as keyof SupplierFormValues;
            const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
            setField(field, value as never);
        },
        [setField]
    );

    // Cambiar de tipo: si el documento elegido no se permite en el nuevo tipo, se limpia
    const changeSupplierType = useCallback((type: SupplierType) => {
        setValues((prev) => ({
            ...prev,
            supplier_type: type,
            document_type:
                prev.document_type && ALLOWED_DOCUMENT_TYPES[type].includes(prev.document_type) ? prev.document_type : '',
        }));
        setErrors({});
    }, []);

    // true = se puede enviar; false = hay errores (ya quedan en `errors`)
    const validate = useCallback((): boolean => {
        const nextErrors = validateSupplierForm(values);
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }, [values]);

    return { values, errors, setField, handleChange, changeSupplierType, validate };
}
