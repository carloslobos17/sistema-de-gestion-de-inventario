// src/features/customers/model/customers.mappers.ts
// Funciones puras: convierten datos de una forma a otra (sin estado ni peticiones).
import { formatDocumentNumber, formatNrc, normalizeDocumentNumber, onlyDigits } from '../../fiscal/model/fiscal.utils';
import { EMPTY_LOCATION } from './customers.constants';
import type {
    CreateCustomerPayload,
    Customer,
    CustomerFilters,
    CustomerFormValues,
    UpdateCustomerPayload,
} from './customers.types';

// "" → null (el backend guarda null en los campos opcionales vacíos)
const toNullable = (value: string) => value.trim().replace(/\s+/g, ' ') || null;

// "500.5" → 500.5 · "" → 0
const toAmount = (value: string) => Number(value.replace(/,/g, '')) || 0;

// Filtros → query string de GET /api/customers (omite los vacíos)
export function toCustomerQueryParams(filters: CustomerFilters): Record<string, string> {
    const params: Record<string, string> = {};

    if (filters.search?.trim()) params.search = filters.search.trim();
    if (filters.is_active !== undefined) params.is_active = String(filters.is_active);
    if (filters.customer_type) params.customer_type = filters.customer_type;
    if (filters.page) params.page = String(filters.page);
    if (filters.limit) params.limit = String(filters.limit);

    return params;
}

// Cliente del backend → valores iniciales del formulario (modo editar)
export function toCustomerFormValues(customer: Customer): CustomerFormValues {
    return {
        customer_type: customer.customer_type,
        name: customer.name,
        trade_name: customer.trade_name ?? '',
        gender: customer.gender ?? '',
        document_type: customer.document_type ?? '',
        document_number:
            customer.document_type && customer.document_number
                ? formatDocumentNumber(customer.document_type, customer.document_number)
                : '',
        nrc: formatNrc(customer.nrc),
        economic_activity_code: customer.economic_activity_code ?? '',
        location:
            customer.district_id && customer.municipality_id && customer.department_code
                ? {
                      department_code: customer.department_code,
                      municipality_id: String(customer.municipality_id),
                      district_id: String(customer.district_id),
                  }
                : EMPTY_LOCATION,
        address: customer.address ?? '',
        phone: customer.phone ?? '',
        phone_alt: customer.phone_alt ?? '',
        email: customer.email ?? '',
        credit_limit: customer.credit_limit.toFixed(2),
    };
}

// Formulario (ya validado) → body de POST /api/customers.
// - Consumidor final: no envía los campos de contribuyente (nombre comercial, NRC, actividad).
// - canEditCreditLimit = false (vendedor): NO envía credit_limit, si no el backend responde 403.
export function toCreateCustomerPayload(values: CustomerFormValues, canEditCreditLimit: boolean): CreateCustomerPayload {
    const documentType = values.document_type || null;

    const common: CreateCustomerPayload = {
        customer_type: values.customer_type,
        name: values.name.trim().replace(/\s+/g, ' '),
        gender: values.gender || null,
        document_type: documentType,
        document_number: documentType ? normalizeDocumentNumber(documentType, values.document_number) : null,
        district_id: values.location.district_id ? Number(values.location.district_id) : null,
        address: toNullable(values.address),
        phone: toNullable(values.phone),
        phone_alt: toNullable(values.phone_alt),
        email: toNullable(values.email)?.toLowerCase() ?? null,
        ...(canEditCreditLimit ? { credit_limit: toAmount(values.credit_limit) } : {}),
    };

    if (values.customer_type === 'FinalConsumer') return common;

    return {
        ...common,
        trade_name: toNullable(values.trade_name),
        nrc: onlyDigits(values.nrc),
        economic_activity_code: values.economic_activity_code,
    };
}

// Formulario → body de PATCH /api/customers/:id: solo los campos que cambiaron.
// El backend combina estos cambios con los datos actuales y valida todo según el tipo.
// Si el vendedor no puede editar el crédito, credit_limit nunca se incluye (evita el 403).
export function toUpdateCustomerPayload(
    values: CustomerFormValues,
    original: Customer,
    canEditCreditLimit: boolean
): UpdateCustomerPayload {
    const next = toCreateCustomerPayload(values, canEditCreditLimit);
    const payload: Record<string, unknown> = {};

    (Object.keys(next) as (keyof CreateCustomerPayload)[]).forEach((key) => {
        if (next[key] !== original[key]) payload[key] = next[key];
    });

    return payload as UpdateCustomerPayload;
}
