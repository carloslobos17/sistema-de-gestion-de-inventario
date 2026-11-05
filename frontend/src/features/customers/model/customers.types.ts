// src/features/customers/model/customers.types.ts
// Contrato del módulo de clientes: datos del backend, formulario y props de TODOS los componentes.
// ⚠️ Archivo compartido por el equipo: si necesitas cambiar algo aquí, avisa antes (lo usan las 3 personas).
import type { ChangeEvent } from 'react';
import type { ActionResult } from '../../../types/common';
import type { DocumentType } from '../../fiscal/model/fiscal.types';
import type { LocationValue } from '../../locations/model/locations.types';

// Consumidor final: se le emite Factura. Contribuyente: inscrito en IVA, se le puede emitir CCF.
export type CustomerType = 'FinalConsumer' | 'Taxpayer';
export type Gender = 'M' | 'F';

// ==========================================
// DATOS DEL BACKEND
// ==========================================

// Cliente tal como lo devuelve /api/customers (documento y NRC llegan sin guiones).
// La ubicación es opcional para el consumidor final: por eso esos campos pueden venir en null.
export interface Customer {
    id: number;
    customer_type: CustomerType;
    name: string; // nombre completo o razón social
    trade_name: string | null; // nombre comercial (solo contribuyente)
    gender: Gender | null;
    document_type: DocumentType | null;
    document_number: string | null;
    nrc: string | null;
    economic_activity_code: string | null;
    economic_activity_name: string | null;
    department_code: string | null;
    municipality_id: number | null;
    district_id: number | null;
    location_label: string | null; // "Distrito, Municipio, Departamento"
    address: string | null;
    phone: string | null;
    phone_alt: string | null;
    email: string | null;
    credit_limit: number; // en dólares (0 = sin crédito)
    is_active: boolean;
    created_at: string;
}

// Filtros del listado → GET /api/customers?search=&is_active=&customer_type=&page=&limit=
export interface CustomerFilters {
    search?: string;
    is_active?: boolean;
    customer_type?: CustomerType;
    page?: number; // sin page el backend usa 1
    limit?: number; // sin limit el backend usa 10
}

// POST /api/customers (el backend aplica las reglas según customer_type).
// credit_limit SOLO lo envía un usuario con can_manage_structure (si lo envía un vendedor → 403).
export interface CreateCustomerPayload {
    customer_type: CustomerType;
    name: string;
    trade_name?: string | null;
    gender: Gender | null;
    document_type: DocumentType | null;
    document_number: string | null;
    nrc?: string | null;
    economic_activity_code?: string | null;
    district_id: number | null;
    address: string | null;
    phone: string | null;
    phone_alt: string | null;
    email: string | null;
    credit_limit?: number;
}

// PATCH /api/customers/:id → solo lo que cambia (credit_limit e is_active requieren permiso)
export type UpdateCustomerPayload = Partial<CreateCustomerPayload & { is_active: boolean }>;

// Resultado de crear / editar un cliente
export type CustomerActionResult = ActionResult<Customer>;

// ==========================================
// LISTADO
// ==========================================

export type CustomerStatusTab = 'active' | 'inactive';

// "" = Todos los tipos
export type CustomerTypeFilter = CustomerType | '';

export interface CustomerStatusTabOption {
    value: CustomerStatusTab;
    label: string;
}

export interface CustomerTypeOption {
    value: CustomerType;
    label: string;
    description: string;
}

export interface CustomerTypeFilterOption {
    value: CustomerTypeFilter;
    label: string;
}

export interface GenderOption {
    value: Gender;
    label: string;
}

// ==========================================
// FORMULARIO (página propia: tiene varios campos)
// ==========================================

// Todo es texto mientras se escribe ("" = vacío); el mapper lo convierte al enviar
export interface CustomerFormValues {
    customer_type: CustomerType;
    name: string;
    trade_name: string;
    gender: Gender | '';
    document_type: DocumentType | '';
    document_number: string;
    nrc: string;
    economic_activity_code: string;
    location: LocationValue;
    address: string;
    phone: string;
    phone_alt: string;
    email: string;
    credit_limit: string; // "500.00"
}

export type CustomerFormErrors = Partial<Record<keyof CustomerFormValues, string>>;

export type CustomerFormMode = 'create' | 'edit';

// Lo que devuelve useCustomerForm (lo usan CustomerForm y las secciones)
export interface UseCustomerFormResult {
    values: CustomerFormValues;
    errors: CustomerFormErrors;
    setField: <K extends keyof CustomerFormValues>(field: K, value: CustomerFormValues[K]) => void;
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    changeCustomerType: (type: CustomerType) => void;
    validate: () => boolean;
}

// ==========================================
// PROPS DE COMPONENTES
// ==========================================

// Pestañas Activos/Inactivos + tipo + búsqueda
export interface CustomerFiltersBarProps {
    status: CustomerStatusTab;
    onStatusChange: (status: CustomerStatusTab) => void;
    customerType: CustomerTypeFilter;
    onCustomerTypeChange: (type: CustomerTypeFilter) => void;
    search: string;
    onSearchChange: (search: string) => void;
}

// Tabla. "Editar" lo ven todos; "Desactivar/Reactivar" solo con permiso (canManage)
export interface CustomerTableProps {
    customers: Customer[];
    canManage: boolean;
    onCustomerStatusChanged: (customer: Customer) => void; // se desactivó/reactivó → quitarlo de la pestaña
}

// Botón "Desactivar" / "Reactivar" de cada fila (abre el ConfirmModal)
export interface CustomerStatusButtonProps {
    customer: Customer;
    onChanged: (customer: Customer) => void;
}

// Formulario compartido por CreateCustomerPage y EditCustomerPage
export interface CustomerFormProps {
    mode: CustomerFormMode;
    initialValues?: CustomerFormValues;
    isSaving: boolean;
    canEditCreditLimit: boolean; // true = admin (campo editable); false = vendedor (tarjeta de solo lectura)
    onSubmit: (values: CustomerFormValues) => void;
    onCancel: () => void;
}

// Props comunes de las secciones del formulario (General, Fiscal, Ubicación, Contacto)
export interface CustomerFormSectionProps {
    idPrefix: string; // de useId(), para que los id de los campos no se repitan
    values: CustomerFormValues;
    errors: CustomerFormErrors;
    setField: UseCustomerFormResult['setField'];
    handleChange: UseCustomerFormResult['handleChange'];
    disabled: boolean;
}

// Tarjetas "Consumidor final" / "Contribuyente"
export interface CustomerTypeSectionProps {
    value: CustomerType;
    onChange: (type: CustomerType) => void;
    disabled: boolean;
}

// Límite de crédito: editable (admin) o tarjeta de solo lectura (vendedor)
export interface CustomerCreditSectionProps {
    idPrefix: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    canEdit: boolean;
    disabled: boolean;
}
