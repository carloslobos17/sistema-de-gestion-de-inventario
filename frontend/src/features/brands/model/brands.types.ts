// src/features/brands/model/brands.types.ts
// [H0 · BASE] Contrato del módulo de marcas. NO cambiar sin avisar al equipo:
// todos los componentes y hooks dependen de estos tipos.
import type { ActionResult } from '../../../types/common';

// ==========================================
// DATOS DEL BACKEND
// ==========================================

// Marca tal como la devuelve /api/brands
export interface Brand {
    id: number;
    name: string;
    is_active: boolean;
}

// Filtros del listado → GET /api/brands?search=&is_active=
export interface BrandFilters {
    search?: string;
    is_active?: boolean;
}

// POST /api/brands
export interface CreateBrandPayload {
    name: string;
}

// PATCH /api/brands/:id → solo lo que cambia
export type UpdateBrandPayload = Partial<CreateBrandPayload & { is_active: boolean }>;

// Resultado de crear / editar / reactivar una marca
export type BrandActionResult = ActionResult<Brand>;

// ==========================================
// LISTADO (H1)
// ==========================================

export type BrandStatusTab = 'active' | 'inactive';

export interface BrandStatusTabOption {
    value: BrandStatusTab;
    label: string;
}

// ==========================================
// FORMULARIO (H2)
// ==========================================

export interface BrandFormValues {
    name: string;
}

export type BrandFormErrors = Partial<Record<keyof BrandFormValues, string>>;

export type BrandFormMode = 'create' | 'edit';

// ==========================================
// PROPS DE COMPONENTES
// ==========================================

// H1 · Pestañas Activas/Inactivas + búsqueda por nombre
export interface BrandFiltersBarProps {
    status: BrandStatusTab;
    onStatusChange: (status: BrandStatusTab) => void;
    search: string;
    onSearchChange: (search: string) => void;
}

// H1 · Tabla. Cada fila monta <EditBrandButton> (H2) y <BrandStatusButton> (H3)
export interface BrandTableProps {
    brands: Brand[];
    onBrandSaved: (brand: Brand) => void; // se editó una marca → actualizar la fila
    onBrandStatusChanged: (brand: Brand) => void; // se desactivó/reactivó → quitarla de la pestaña actual
}

// H2 · Botón "+ Nueva marca" (va en el PageHeader)
export interface CreateBrandButtonProps {
    onCreated: (brand: Brand) => void;
}

// H2 · Botón "Editar" de cada fila
export interface EditBrandButtonProps {
    brand: Brand;
    onSaved: (brand: Brand) => void;
}

// H2 · Un solo modal para crear y editar
export interface BrandFormModalProps {
    isOpen: boolean;
    mode: BrandFormMode;
    brand?: Brand; // solo en modo "edit"
    onClose: () => void;
    onSuccess: (brand: Brand) => void;
}

// H3 · Botón "Desactivar" / "Reactivar" de cada fila (abre el ConfirmModal)
export interface BrandStatusButtonProps {
    brand: Brand;
    onChanged: (brand: Brand) => void;
}
