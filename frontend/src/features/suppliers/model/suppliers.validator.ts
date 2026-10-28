// src/features/suppliers/model/suppliers.validator.ts
// Reglas del formulario de proveedor. Iguales a las del backend:
//   - Contribuyente: NIT o DUI, NRC y actividad económica obligatorios.
//   - Sujeto excluido: cualquier documento, teléfono obligatorio.
//   - Ambos: nombre, documento, ubicación, dirección y correo obligatorios.
// Devuelve TODOS los errores a la vez (formato de cada campo con Zod + reglas que dependen del tipo).
import { z } from 'zod';
import { getDocumentNumberError, isValidNrc } from '../../fiscal/model/fiscal.utils';
import { ALLOWED_DOCUMENT_TYPES, SUPPLIER_LIMITS } from './suppliers.constants';
import type { SupplierFormErrors, SupplierFormValues } from './suppliers.types';

const PHONE_REGEX = /^[\d\s()+-]*$/;
const PHONE_MESSAGE = 'Solo números, espacios, +, - y paréntesis';

// Formato de cada campo (no depende del tipo de proveedor)
const supplierFieldsSchema = z.object({
    name: z
        .string()
        .trim()
        .min(SUPPLIER_LIMITS.NAME_MIN, `El nombre debe tener al menos ${SUPPLIER_LIMITS.NAME_MIN} caracteres`)
        .max(SUPPLIER_LIMITS.NAME_MAX, `El nombre no puede superar los ${SUPPLIER_LIMITS.NAME_MAX} caracteres`),
    legal_name: z.string().trim().max(SUPPLIER_LIMITS.LEGAL_NAME_MAX, 'La razón social es demasiado larga'),
    address: z.string().trim().min(1, 'La dirección es obligatoria').max(SUPPLIER_LIMITS.ADDRESS_MAX, 'La dirección es demasiado larga'),
    phone: z.string().trim().max(SUPPLIER_LIMITS.PHONE_MAX, 'El teléfono es demasiado largo').regex(PHONE_REGEX, PHONE_MESSAGE),
    phone_alt: z.string().trim().max(SUPPLIER_LIMITS.PHONE_MAX, 'El teléfono es demasiado largo').regex(PHONE_REGEX, PHONE_MESSAGE),
    email: z
        .string()
        .trim()
        .min(1, 'El correo es obligatorio')
        .max(SUPPLIER_LIMITS.EMAIL_MAX, 'El correo es demasiado largo')
        .refine((value) => value === '' || z.email().safeParse(value).success, { message: 'El correo no es válido' }),
    contact_name: z.string().trim().max(SUPPLIER_LIMITS.CONTACT_NAME_MAX, 'El nombre del contacto es demasiado largo'),
});

export function validateSupplierForm(values: SupplierFormValues): SupplierFormErrors {
    const errors: SupplierFormErrors = {};
    const isTaxpayer = values.supplier_type === 'Taxpayer';

    // 1. Formato de cada campo
    const result = supplierFieldsSchema.safeParse(values);
    if (!result.success) {
        result.error.issues.forEach((issue) => {
            const field = issue.path[0] as keyof SupplierFormValues;
            if (!errors[field]) errors[field] = issue.message;
        });
    }

    // 2. Documento: el tipo debe estar permitido y el número cumplir su formato
    if (!values.document_type) {
        errors.document_type = 'Seleccione el tipo de identificación';
    } else if (!ALLOWED_DOCUMENT_TYPES[values.supplier_type].includes(values.document_type)) {
        errors.document_type = 'Un contribuyente se identifica con NIT o DUI';
    } else {
        const documentError = getDocumentNumberError(values.document_type, values.document_number);
        if (documentError) errors.document_number = documentError;
    }

    // 3. Ubicación completa
    if (!values.location.district_id) {
        errors.location = 'Seleccione el departamento, el municipio y el distrito';
    }

    // 4. Según el tipo
    if (isTaxpayer) {
        if (!isValidNrc(values.nrc)) errors.nrc = 'El NRC es obligatorio (de 1 a 8 dígitos)';
        if (!values.economic_activity_code) errors.economic_activity_code = 'Seleccione la actividad económica';
    } else if (!values.phone.trim() && !errors.phone) {
        errors.phone = 'El teléfono es obligatorio';
    }

    return errors;
}
