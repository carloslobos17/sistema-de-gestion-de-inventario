// src/features/customers/model/customers.validator.ts
// Reglas del formulario de cliente. Iguales a las del backend (backend/src/modules/customers/customer.schema.ts):
//   - Ambos tipos: nombre obligatorio; teléfonos, correo y límite de crédito con formato válido.
//   - Consumidor final: documento y ubicación opcionales, pero "todo o nada".
//   - Contribuyente: NIT o DUI, NRC, actividad económica, ubicación completa, dirección y correo obligatorios.
// Devuelve TODOS los errores a la vez: { campo: "mensaje" }. Objeto vacío = formulario válido.
import { z } from 'zod';
import { getDocumentNumberError, isValidNrc } from '../../fiscal/model/fiscal.utils';
import { ALLOWED_DOCUMENT_TYPES, CUSTOMER_LIMITS } from './customers.constants';
import type { CustomerFormErrors, CustomerFormValues } from './customers.types';

const PHONE_REGEX = /^[\d\s()+-]*$/;
const PHONE_MESSAGE = 'Solo números, espacios, +, - y paréntesis';

// Monto: solo dígitos, con punto y hasta 2 decimales ("500", "500.5", "500.50"). Sin signo: no puede ser negativo.
const MONEY_REGEX = /^\d+(\.\d{1,2})?$/;

const phoneSchema = z
    .string()
    .trim()
    .max(CUSTOMER_LIMITS.PHONE_MAX, `El teléfono no puede superar los ${CUSTOMER_LIMITS.PHONE_MAX} caracteres`)
    .regex(PHONE_REGEX, PHONE_MESSAGE);

// 1. Formato de cada campo (no depende del tipo de cliente). Los vacíos se revisan después, según el tipo.
const customerFieldsSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'El nombre es obligatorio')
        .min(CUSTOMER_LIMITS.NAME_MIN, `El nombre debe tener al menos ${CUSTOMER_LIMITS.NAME_MIN} caracteres`)
        .max(CUSTOMER_LIMITS.NAME_MAX, `El nombre no puede superar los ${CUSTOMER_LIMITS.NAME_MAX} caracteres`),
    trade_name: z
        .string()
        .trim()
        .max(CUSTOMER_LIMITS.TRADE_NAME_MAX, `El nombre comercial no puede superar los ${CUSTOMER_LIMITS.TRADE_NAME_MAX} caracteres`),
    address: z
        .string()
        .trim()
        .max(CUSTOMER_LIMITS.ADDRESS_MAX, `La dirección no puede superar los ${CUSTOMER_LIMITS.ADDRESS_MAX} caracteres`),
    phone: phoneSchema,
    phone_alt: phoneSchema,
    email: z
        .string()
        .trim()
        .max(CUSTOMER_LIMITS.EMAIL_MAX, `El correo no puede superar los ${CUSTOMER_LIMITS.EMAIL_MAX} caracteres`)
        .refine((value) => value === '' || z.email().safeParse(value).success, { message: 'El correo no es válido' }),
});

// Mensaje de error del límite de crédito (o null si está bien). "" cuenta como 0 (sin crédito).
function getCreditLimitError(value: string): string | null {
    const amount = value.trim().replace(/,/g, '');
    if (amount === '') return null;
    if (!MONEY_REGEX.test(amount)) return 'El límite de crédito debe ser un número mayor o igual a 0, con máximo 2 decimales';
    if (Number(amount) > CUSTOMER_LIMITS.CREDIT_LIMIT_MAX) return 'El límite de crédito es demasiado alto';
    return null;
}

export function validateCustomerForm(values: CustomerFormValues): CustomerFormErrors {
    const errors: CustomerFormErrors = {};
    const isTaxpayer = values.customer_type === 'Taxpayer';

    // 1. Formato de cada campo (se guarda solo el primer mensaje de cada uno)
    const result = customerFieldsSchema.safeParse(values);
    if (!result.success) {
        result.error.issues.forEach((issue) => {
            const field = issue.path[0] as keyof CustomerFormValues;
            if (!errors[field]) errors[field] = issue.message;
        });
    }

    // 2. Límite de crédito: >= 0, máximo 2 decimales
    const creditLimitError = getCreditLimitError(values.credit_limit);
    if (creditLimitError) errors.credit_limit = creditLimitError;

    // 3. Documento: obligatorio para contribuyente (solo NIT o DUI); en consumidor final, todo o nada
    const hasDocumentNumber = values.document_number.trim() !== '';
    if (!values.document_type) {
        if (isTaxpayer) {
            errors.document_type = 'Seleccione el tipo de identificación (NIT o DUI)';
        } else if (hasDocumentNumber) {
            errors.document_type = 'Seleccione el tipo de documento';
        }
    } else if (!ALLOWED_DOCUMENT_TYPES[values.customer_type].includes(values.document_type)) {
        errors.document_type = 'Un contribuyente se identifica con NIT o DUI';
    } else {
        // Revisa que haya número y que cumpla el formato de su tipo (DUI 9, NIT 14 o 9, otros 3-20)
        const documentError = getDocumentNumberError(values.document_type, values.document_number);
        if (documentError) errors.document_number = documentError;
    }

    // 4. Ubicación
    const { department_code, municipality_id, district_id } = values.location;
    if (isTaxpayer) {
        if (!district_id) errors.location = 'Seleccione el departamento, el municipio y el distrito';
    } else if ((department_code || municipality_id) && !district_id) {
        // Consumidor final: opcional, pero si empezó a elegirla debe terminarla (si no, se perdería al guardar)
        errors.location = 'Completa el municipio y el distrito';
    }

    // 5. Solo contribuyente: NRC, actividad, dirección y correo obligatorios
    if (isTaxpayer) {
        if (!isValidNrc(values.nrc)) errors.nrc = 'El NRC es obligatorio (de 1 a 8 dígitos)';
        if (!values.economic_activity_code) errors.economic_activity_code = 'Seleccione la actividad económica';
        if (!values.address.trim() && !errors.address) errors.address = 'La dirección es obligatoria';
        if (!values.email.trim() && !errors.email) errors.email = 'El correo es obligatorio';
    }

    return errors;
}
