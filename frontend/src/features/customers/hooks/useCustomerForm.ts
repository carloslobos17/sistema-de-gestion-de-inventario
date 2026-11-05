// src/features/customers/hooks/useCustomerForm.ts
// 👤 DUEÑO: Persona 1
// Estado del formulario de cliente y su validación. Lo usa CustomerForm y se lo pasa a las secciones.
// Ya funciona lo básico (escribir en los campos) para que la Persona 2 pueda probar sus secciones.
//
// TODO (Persona 1):
//   [ ] changeCustomerType: si el documento elegido NO se permite en el nuevo tipo (ALLOWED_DOCUMENT_TYPES),
//       limpiarlo (document_type: "", document_number: ""), y borrar todos los errores.
//       Ej.: consumidor final con Pasaporte → pasa a contribuyente → el documento se limpia.
//   Referencia: src/features/suppliers/hooks/useSupplierForm.ts
import { useCallback, useState, type ChangeEvent } from 'react';
import { EMPTY_CUSTOMER_FORM } from '../model/customers.constants';
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

    // TODO (Persona 1): limpiar el documento si no se permite en el nuevo tipo
    const changeCustomerType = useCallback((type: CustomerType) => {
        setValues((prev) => ({ ...prev, customer_type: type }));
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
