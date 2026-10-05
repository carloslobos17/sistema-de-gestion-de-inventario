// =====================================================================
// H1 · Ver y buscar marcas — Integrante 1
// Archivo: features/brands/components/BrandFiltersBar.tsx
// ---------------------------------------------------------------------
// QUÉ HACE: dibuja las pestañas Activas/Inactivas y la barra de búsqueda por nombre.
// Solo dibuja: el estado vive en useBrandFilters (la página se lo pasa por props).
//
// ESTADO ACTUAL: funciona pero sin estilos.
//
// TAREAS:
//   [ ] Pestañas con el mismo diseño que UserFiltersBar (role="tablist", aria-selected)
//   [ ] Usar BRAND_STATUS_TABS (model/brands.constants.ts) en lugar de escribir las pestañas a mano
//   [ ] Búsqueda con el componente <Input> (components/ui/Input.tsx), ícono <Search>
//       de lucide a la izquierda (className="pl-9"), placeholder "Buscar marca por nombre..."
//   [ ] aria-label en el input de búsqueda
//
// NO CAMBIAR: las props (BrandFiltersBarProps en model/brands.types.ts)
// REFERENCIA: features/users/components/UserFiltersBar.tsx (sin el select de rol)
// =====================================================================
import type { BrandFiltersBarProps } from "../model/brands.types";

export function BrandFiltersBar({ status, onStatusChange, search, onSearchChange }: BrandFiltersBarProps) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* TODO H1: reemplazar por pestañas con estilo usando BRAND_STATUS_TABS */}
            <button type="button" onClick={() => onStatusChange("active")} disabled={status === "active"}>
                Activas
            </button>
            <button type="button" onClick={() => onStatusChange("inactive")} disabled={status === "inactive"}>
                Inactivas
            </button>

            {/* TODO H1: usar <Input> con ícono de búsqueda */}
            <input
                type="search"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar marca por nombre..."
            />
        </div>
    );
}
