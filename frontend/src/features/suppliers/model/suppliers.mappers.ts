// src/features/suppliers/model/suppliers.mappers.ts
// Funciones puras: convierten datos de una forma a otra (sin estado ni peticiones).
import { formatDocumentNumber, formatNrc, normalizeDocumentNumber, onlyDigits } from '../../fiscal/model/fiscal.utils';
import type {
    CreateSupplierPayload,
    Supplier,
    SupplierFilters,
    SupplierFormValues,
    UpdateSupplierPayload,
} from './suppliers.types';

// "" → null (el backend guarda null en los campos opcionales vacíos)
const toNullable = (value: string) => value.trim().replace(/\s+/g, ' ') || null;

// Filtros → query string de GET /api/suppliers (omite los vacíos)
export function toSupplierQueryParams(filters: SupplierFilters): Record<string, string> {
    const params: Record<string, string> = {};

    if (filters.search?.trim()) params.search = filters.search.trim();
    if (filters.is_active !== undefined) params.is_active = String(filters.is_active);
    if (filters.supplier_type) params.supplier_type = filters.supplier_type;
    if (filters.page) params.page = String(filters.page);
    if (filters.limit) params.limit = String(filters.limit);

    return params;
}

// Proveedor del backend → valores iniciales del formulario (modo editar)
export function toSupplierFormValues(supplier: Supplier): SupplierFormValues {
    return {
        supplier_type: supplier.supplier_type,
        name: supplier.name,
        legal_name: supplier.legal_name ?? '',
        document_type: supplier.document_type,
        document_number: formatDocumentNumber(supplier.document_type, supplier.document_number),
        nrc: formatNrc(supplier.nrc),
        economic_activity_code: supplier.economic_activity_code ?? '',
        location: {
            department_code: supplier.department_code,
            municipality_id: String(supplier.municipality_id),
            district_id: String(supplier.district_id),
        },
        address: supplier.address,
        phone: supplier.phone ?? '',
        phone_alt: supplier.phone_alt ?? '',
        email: supplier.email,
        contact_name: supplier.contact_name ?? '',
        applies_perception: supplier.applies_perception,
    };
}

// Formulario (ya validado) → body de POST /api/suppliers.
// Un sujeto excluido no envía los campos de contribuyente (NRC, actividad, razón social...).
export function toCreateSupplierPayload(values: SupplierFormValues): CreateSupplierPayload {
    const documentType = values.document_type || 'NIT';

    const common = {
        supplier_type: values.supplier_type,
        name: values.name.trim().replace(/\s+/g, ' '),
        document_type: documentType,
        document_number: normalizeDocumentNumber(documentType, values.document_number),
        district_id: Number(values.location.district_id),
        address: values.address.trim(),
        phone: toNullable(values.phone),
        phone_alt: toNullable(values.phone_alt),
        email: values.email.trim().toLowerCase(),
    };

    if (values.supplier_type === 'ExcludedSubject') return common;

    return {
        ...common,
        legal_name: toNullable(values.legal_name),
        nrc: onlyDigits(values.nrc),
        economic_activity_code: values.economic_activity_code,
        contact_name: toNullable(values.contact_name),
        applies_perception: values.applies_perception,
    };
}

// Formulario → body de PATCH /api/suppliers/:id: solo los campos que cambiaron.
// El backend combina estos cambios con los datos actuales y valida todo según el tipo.
export function toUpdateSupplierPayload(values: SupplierFormValues, original: Supplier): UpdateSupplierPayload {
    const next = toCreateSupplierPayload(values);
    const payload: Record<string, unknown> = {};

    (Object.keys(next) as (keyof CreateSupplierPayload)[]).forEach((key) => {
        if (next[key] !== original[key]) payload[key] = next[key];
    });

    return payload as UpdateSupplierPayload;
}
