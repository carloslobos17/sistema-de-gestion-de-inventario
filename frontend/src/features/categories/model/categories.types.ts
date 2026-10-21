// src/features/categories/model/categories.types.ts
// Contrato del módulo de categorías: datos del backend, formulario y props de componentes.
import type { ActionResult } from '../../../types/common';

// ==========================================
// DATOS DEL BACKEND
// ==========================================

// Categoría tal como la devuelve /api/categories
export interface Category {
    id: number;
    name: string;
    is_active: boolean;
}

// Filtros del listado → GET /api/categories?search=&is_active=&page=&limit=
export interface CategoryFilters {
    search?: string;
    is_active?: boolean;
    page?: number; // sin page el backend usa 1
    limit?: number; // sin limit el backend usa 10
}

// POST /api/categories
export interface CreateCategoryPayload {
    name: string;
}

// PATCH /api/categories/:id → solo lo que cambia
export type UpdateCategoryPayload = Partial<CreateCategoryPayload & { is_active: boolean }>;

// Resultado de crear / editar / reactivar una categoría
export type CategoryActionResult = ActionResult<Category>;

// ==========================================
// LISTADO
// ==========================================

export type CategoryStatusTab = 'active' | 'inactive';

export interface CategoryStatusTabOption {
    value: CategoryStatusTab;
    label: string;
}

// ==========================================
// FORMULARIO
// ==========================================

export interface CategoryFormValues {
    name: string;
}

export type CategoryFormErrors = Partial<Record<keyof CategoryFormValues, string>>;

export type CategoryFormMode = 'create' | 'edit';

// ==========================================
// PROPS DE COMPONENTES
// ==========================================

// Pestañas Activas/Inactivas + búsqueda por nombre
export interface CategoryFiltersBarProps {
    status: CategoryStatusTab;
    onStatusChange: (status: CategoryStatusTab) => void;
    search: string;
    onSearchChange: (search: string) => void;
}

// Tabla. Cada fila monta <EditCategoryButton> y <CategoryStatusButton>
export interface CategoryTableProps {
    categories: Category[];
    onCategorySaved: (category: Category) => void; // se editó → actualizar la fila
    onCategoryStatusChanged: (category: Category) => void; // se desactivó/reactivó → quitarla de la pestaña
    canManage: boolean; // false → sin columna Acciones (ej. vendedores)
}

// Botón "+ Nueva categoría" (va en el PageHeader)
export interface CreateCategoryButtonProps {
    onCreated: (category: Category) => void;
}

// Botón "Editar" de cada fila
export interface EditCategoryButtonProps {
    category: Category;
    onSaved: (category: Category) => void;
}

// Un solo modal para crear y editar
export interface CategoryFormModalProps {
    isOpen: boolean;
    mode: CategoryFormMode;
    category?: Category; // solo en modo "edit"
    onClose: () => void;
    onSuccess: (category: Category) => void;
}

// Formulario interno de CategoryFormModal (se monta al abrir el modal)
export interface CategoryFormProps {
    initialValues: CategoryFormValues;
    submitLabel: string;
    isSaving: boolean;
    onSubmit: (values: CategoryFormValues) => void;
    onCancel: () => void;
}

// Botón "Desactivar" / "Reactivar" de cada fila (abre el ConfirmModal)
export interface CategoryStatusButtonProps {
    category: Category;
    onChanged: (category: Category) => void;
}
