// src/modules/suppliers/supplier.types.ts
import type { DocumentTypeValue } from '../../utils/schemaFields';

export type SupplierTypeValue = 'Taxpayer' | 'ExcludedSubject';

// Proveedor tal como se devuelve al frontend (con la ubicación y la actividad ya resueltas)
export interface Supplier {
    id: number;
    supplier_type: SupplierTypeValue;
    name: string;
    legal_name: string | null;
    document_type: DocumentTypeValue;
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
    created_at: Date;
}

// Opción para los selects (GET /api/suppliers/options). Misma forma { id, name } que marcas y categorías.
export interface SupplierOption {
    id: number;
    name: string;
}

// Todos los datos editables, ya validados y completos (los que no aplican al tipo van en null/false)
export interface SupplierData {
    supplier_type: SupplierTypeValue;
    name: string;
    legal_name: string | null;
    document_type: DocumentTypeValue;
    document_number: string;
    nrc: string | null;
    economic_activity_code: string | null;
    district_id: number;
    address: string;
    phone: string | null;
    phone_alt: string | null;
    email: string;
    contact_name: string | null;
    applies_perception: boolean;
}

// Lo que se escribe en la BD al editar
export type UpdateSupplierData = Partial<SupplierData & { is_active: boolean }>;

// Filtros del listado: GET /api/suppliers?search=&is_active=&supplier_type=
export interface SupplierFilters {
    search?: string; // busca en nombre, razón social, contacto, documento y NRC
    is_active?: boolean;
    supplier_type?: SupplierTypeValue;
}
