// src/features/suppliers/model/suppliers.types.ts
// Contrato del módulo de proveedores: datos del backend, formulario y props de componentes.
import type { ActionResult } from '../../../types/common';
import type { DocumentType } from '../../fiscal/model/fiscal.types';
import type { LocationValue } from '../../locations/model/locations.types';

// Contribuyente: inscrito en IVA (tiene NRC). Sujeto excluido: informal, sin NRC.
export type SupplierType = 'Taxpayer' | 'ExcludedSubject';

// ==========================================
// DATOS DEL BACKEND
// ==========================================

// Proveedor tal como lo devuelve /api/suppliers (documento y NRC llegan sin guiones)
export interface Supplier {
    id: number;
    supplier_type: SupplierType;
    name: string;
    legal_name: string | null;
    document_type: DocumentType;
    document_number: string;
    nrc: string | null;
    economic_activity_code: string | null;
    economic_activity_name: string | null;
    department_code: string;
    municipality_id: number;
    district_id: number;
    location_label: string; // "Distrito, Municipio, Departamento"
    address: string;
    phone: string | null;
    phone_alt: string | null;
    email: string;
    contact_name: string | null;
    applies_perception: boolean;
    is_active: boolean;
    created_at: string;
}

// Filtros del listado → GET /api/suppliers?search=&is_active=&supplier_type=&page=&limit=
export interface SupplierFilters {
    search?: string;
    is_active?: boolean;
    supplier_type?: SupplierType;
    page?: number; // sin page el backend usa 1
    limit?: number; // sin limit el backend usa 10
}

// POST /api/suppliers (el backend aplica las reglas según supplier_type)
export interface CreateSupplierPayload {
    supplier_type: SupplierType;
    name: string;
    legal_name?: string | null;
    document_type: DocumentType;
    document_number: string;
    nrc?: string | null;
    economic_activity_code?: string | null;
    district_id: number;
    address: string;
    phone: string | null;
    phone_alt: string | null;
    email: string;
    contact_name?: string | null;
    applies_perception?: boolean;
}

// PATCH /api/suppliers/:id → solo lo que cambia
export type UpdateSupplierPayload = Partial<CreateSupplierPayload & { is_active: boolean }>;

// Resultado de crear / editar / reactivar un proveedor
export type SupplierActionResult = ActionResult<Supplier>;

// ==========================================
// LISTADO
// ==========================================

export type SupplierStatusTab = 'active' | 'inactive';

export interface SupplierStatusTabOption {
    value: SupplierStatusTab;
    label: string;
}

export interface SupplierTypeOption {
    value: SupplierType;
    label: string;
    description: string;
}

// ==========================================
// FORMULARIO (página propia: tiene varios campos)
// ==========================================

// Todo es texto mientras se escribe (salvo la casilla); el mapper lo convierte al enviar
export interface SupplierFormValues {
    supplier_type: SupplierType;
    name: string;
    legal_name: string;
    document_type: DocumentType | '';
    document_number: string;
    nrc: string;
    economic_activity_code: string;
    location: LocationValue;
    address: string;
    phone: string;
    phone_alt: string;
    email: string;
    contact_name: string;
    applies_perception: boolean;
}

export type SupplierFormErrors = Partial<Record<keyof SupplierFormValues, string>>;

export type SupplierFormMode = 'create' | 'edit';

// ==========================================
// PROPS DE COMPONENTES
// ==========================================

// Pestañas Activos/Inactivos + búsqueda
export interface SupplierFiltersBarProps {
    status: SupplierStatusTab;
    onStatusChange: (status: SupplierStatusTab) => void;
    search: string;
    onSearchChange: (search: string) => void;
}

// Tabla. Con permiso, cada fila muestra "Editar" y <SupplierStatusButton>
export interface SupplierTableProps {
    suppliers: Supplier[];
    canManage: boolean; // false → sin columna Acciones (ej. vendedores)
    onSupplierStatusChanged: (supplier: Supplier) => void; // se desactivó/reactivó → quitarlo de la pestaña
}

// Botón "Desactivar" / "Reactivar" de cada fila (abre el ConfirmModal)
export interface SupplierStatusButtonProps {
    supplier: Supplier;
    onChanged: (supplier: Supplier) => void;
}

// Formulario compartido por CreateSupplierPage y EditSupplierPage
export interface SupplierFormProps {
    mode: SupplierFormMode;
    initialValues?: SupplierFormValues;
    isSaving: boolean;
    onSubmit: (values: SupplierFormValues) => void;
    onCancel: () => void;
}
