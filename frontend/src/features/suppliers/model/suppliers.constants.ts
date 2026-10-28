// src/features/suppliers/model/suppliers.constants.ts
// Valores fijos del módulo de proveedores.
import type { DocumentType } from '../../fiscal/model/fiscal.types';
import type { SupplierFormValues, SupplierStatusTabOption, SupplierType, SupplierTypeOption } from './suppliers.types';

export const SUPPLIER_STATUS_TABS: SupplierStatusTabOption[] = [
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' },
];

export const SUPPLIER_TYPE_OPTIONS: SupplierTypeOption[] = [
    { value: 'Taxpayer', label: 'Contribuyente', description: 'Inscrito en IVA: tiene NRC y actividad económica' },
    { value: 'ExcludedSubject', label: 'Sujeto excluido', description: 'Informal, sin NRC (ej. venta de arena o grava)' },
];

export const SUPPLIER_TYPE_LABELS: Record<SupplierType, string> = {
    Taxpayer: 'Contribuyente',
    ExcludedSubject: 'Sujeto excluido',
};

// Documentos permitidos según el tipo (mismas reglas que el backend)
export const ALLOWED_DOCUMENT_TYPES: Record<SupplierType, readonly DocumentType[]> = {
    Taxpayer: ['NIT', 'DUI'],
    ExcludedSubject: ['DUI', 'NIT', 'PASSPORT', 'RESIDENT_CARD', 'OTHER'],
};

// Espera del buscador antes de consultar al backend (ms)
export const SUPPLIER_SEARCH_DEBOUNCE_MS = 300;

// Mismas reglas que el backend (supplier.schema.ts)
export const SUPPLIER_LIMITS = {
    NAME_MIN: 2,
    NAME_MAX: 200,
    LEGAL_NAME_MAX: 200,
    CONTACT_NAME_MAX: 150,
    PHONE_MAX: 50,
    EMAIL_MAX: 150,
    ADDRESS_MAX: 255,
} as const;

export const EMPTY_SUPPLIER_FORM: SupplierFormValues = {
    supplier_type: 'Taxpayer',
    name: '',
    legal_name: '',
    document_type: 'NIT',
    document_number: '',
    nrc: '',
    economic_activity_code: '',
    location: { department_code: '', municipality_id: '', district_id: '' },
    address: '',
    phone: '',
    phone_alt: '',
    email: '',
    contact_name: '',
    applies_perception: false,
};
