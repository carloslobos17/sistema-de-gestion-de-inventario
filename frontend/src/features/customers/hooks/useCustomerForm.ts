// src/features/customers/hooks/useCustomerForm.ts
// 👤 DUEÑO: Persona 1
// Estado del formulario de cliente y su validación. Lo usa CustomerForm y se lo pasa a las secciones.
// Al cambiar de tipo, el documento se limpia si el nuevo tipo no lo permite y se borran los errores.
// Referencia: src/features/suppliers/hooks/useSupplierForm.ts
import { useCallback, useState, type ChangeEvent } from 'react';
import { ALLOWED_DOCUMENT_TYPES, EMPTY_CUSTOMER_FORM } from '../model/customers.constants';
import { validateCustomerForm } from '../model/customers.validator';
import type { CustomerFormErrors, CustomerFormValues, CustomerType, UseCustomerFormResult } from '../model/customers.types';

export function useCustomerForm(initialValues: CustomerFormValues = EMPTY_CUSTOMER_FORM): UseCustomerFormResult {
    const [values, setValues] = useState<CustomerFormValues>(initialValues);
    const [errors, setErrors] = useState<CustomerFormErrors>({});

    // Cambia un campo y borra su error (para componentes que no son <input>: ubicación, actividad, documento)
    const setField = useCallback(<K extends keyof CustomerFormValues>(field: K, value: CustomerFormValues[K]) => {
        setValues((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    }, []);

    // Para <input>, <textarea> y <select>: usa el atributo name como nombre del campo
    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            setField(e.target.name as keyof CustomerFormValues, e.target.value as never);
        },
        [setField]
    );

    // Cambiar de tipo: si el documento elegido no se permite en el nuevo tipo, se limpia (tipo y número).
    // Ej.: consumidor final con Pasaporte → contribuyente (solo NIT o DUI) → documento vacío.
    const changeCustomerType = useCallback((type: CustomerType) => {
        setValues((prev) => {
            const isAllowed = !prev.document_type || ALLOWED_DOCUMENT_TYPES[type].includes(prev.document_type);
            return isAllowed
                ? { ...prev, customer_type: type }
                : { ...prev, customer_type: type, document_type: '', document_number: '' };
        });
        // Los mensajes del tipo anterior ya no aplican
        setErrors({});
    }, []);

    // true = se puede enviar; false = hay errores (ya quedan en `errors`)
    const validate = useCallback((): boolean => {
        const nextErrors = validateCustomerForm(values);
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }, [values]);

    return { values, errors, setField, handleChange, changeCustomerType, validate };
}
