// src/features/customers/model/customers.constants.ts
// Valores fijos del módulo de clientes.
import type { DocumentType } from '../../fiscal/model/fiscal.types';
import type { LocationValue } from '../../locations/model/locations.types';
import type {
    CustomerFormValues,
    CustomerStatusTabOption,
    CustomerType,
    CustomerTypeFilterOption,
    CustomerTypeOption,
    Gender,
    GenderOption,
} from './customers.types';

export const CUSTOMER_STATUS_TABS: CustomerStatusTabOption[] = [
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' },
];

// Tarjetas del formulario (mismos textos que el diseño de Stitch)
export const CUSTOMER_TYPE_OPTIONS: CustomerTypeOption[] = [
    { value: 'FinalConsumer', label: 'Consumidor final', description: 'Persona que compra para uso propio. Se le emite Factura.' },
    { value: 'Taxpayer', label: 'Contribuyente', description: 'Empresa o persona inscrita en IVA. Se le puede emitir Crédito Fiscal (CCF).' },
];

export const CUSTOMER_TYPE_LABELS: Record<CustomerType, string> = {
    FinalConsumer: 'Consumidor final',
    Taxpayer: 'Contribuyente',
};

// Select "Tipo" de la barra de filtros
export const CUSTOMER_TYPE_FILTER_OPTIONS: CustomerTypeFilterOption[] = [
    { value: '', label: 'Tipo: Todos' },
    { value: 'FinalConsumer', label: 'Consumidor final' },
    { value: 'Taxpayer', label: 'Contribuyente' },
];

// Insignia de tipo en la tabla: gris = consumidor final, azul = contribuyente
export const CUSTOMER_TYPE_BADGE_CLASSES: Record<CustomerType, string> = {
    FinalConsumer: 'border-slate-200 bg-slate-100 text-slate-600',
    Taxpayer: 'border-blue-200 bg-blue-50 text-blue-700',
};

export const GENDER_OPTIONS: GenderOption[] = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
];

export const GENDER_LABELS: Record<Gender, string> = {
    M: 'Masculino',
    F: 'Femenino',
};

// Documentos permitidos según el tipo (mismas reglas que el backend)
export const ALLOWED_DOCUMENT_TYPES: Record<CustomerType, readonly DocumentType[]> = {
    FinalConsumer: ['DUI', 'NIT', 'PASSPORT', 'RESIDENT_CARD', 'OTHER'],
    Taxpayer: ['NIT', 'DUI'],
};

// Espera del buscador antes de consultar al backend (ms)
export const CUSTOMER_SEARCH_DEBOUNCE_MS = 300;

// Mismas reglas que el backend (customer.schema.ts)
export const CUSTOMER_LIMITS = {
    NAME_MIN: 2,
    NAME_MAX: 200,
    TRADE_NAME_MAX: 200,
    PHONE_MAX: 50,
    EMAIL_MAX: 150,
    ADDRESS_MAX: 255,
    CREDIT_LIMIT_MAX: 9_999_999_999.99,
} as const;

export const EMPTY_LOCATION: LocationValue = { department_code: '', municipality_id: '', district_id: '' };

// Formulario vacío: consumidor final, sin documento, sin crédito
export const EMPTY_CUSTOMER_FORM: CustomerFormValues = {
    customer_type: 'FinalConsumer',
    name: '',
    trade_name: '',
    gender: '',
    document_type: '',
    document_number: '',
    nrc: '',
    economic_activity_code: '',
    location: EMPTY_LOCATION,
    address: '',
    phone: '',
    phone_alt: '',
    email: '',
    credit_limit: '0.00',
};
