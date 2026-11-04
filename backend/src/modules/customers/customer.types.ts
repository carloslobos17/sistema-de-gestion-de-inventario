// src/modules/customers/customer.types.ts
import type { DocumentTypeValue } from '../../utils/schemaFields';

export type CustomerTypeValue = 'FinalConsumer' | 'Taxpayer';
export type GenderValue = 'M' | 'F';

// Cliente tal como se devuelve al frontend (con la ubicación y la actividad ya resueltas).
// La ubicación es opcional para el consumidor final, por eso esos campos pueden ser null.
export interface Customer {
    id: number;
    customer_type: CustomerTypeValue;
    name: string;
    trade_name: string | null;
    gender: GenderValue | null;
    document_type: DocumentTypeValue | null;
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
    credit_limit: number; // en dólares (la BD lo guarda como Decimal)
    is_active: boolean;
    created_at: Date;
}

// Todos los datos editables, ya validados y completos (los que no aplican al tipo van en null).
// credit_limit es opcional: si no viene, al crear queda en 0 (valor por defecto de la BD).
export interface CustomerData {
    customer_type: CustomerTypeValue;
    name: string;
    trade_name: string | null;
    gender: GenderValue | null;
    document_type: DocumentTypeValue | null;
    document_number: string | null;
    nrc: string | null;
    economic_activity_code: string | null;
    district_id: number | null;
    address: string | null;
    phone: string | null;
    phone_alt: string | null;
    email: string | null;
    credit_limit?: number;
}

// Lo que se escribe en la BD al editar
export type UpdateCustomerData = Partial<CustomerData & { is_active: boolean }>;

// Filtros del listado: GET /api/customers?search=&is_active=&customer_type=
export interface CustomerFilters {
    search?: string; // busca en nombre, nombre comercial, documento, NRC, teléfono y correo
    is_active?: boolean;
    customer_type?: CustomerTypeValue;
}
