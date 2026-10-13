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
