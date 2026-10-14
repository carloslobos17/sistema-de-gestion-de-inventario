// =====================================================================
// H1 · Ver y buscar marcas — Integrante 1
// Archivo: features/brands/components/BrandFiltersBar.tsx
// ---------------------------------------------------------------------
// QUÉ HACE: dibuja las pestañas Activas/Inactivas y la barra de búsqueda por nombre.
// Solo dibuja: el estado vive en useBrandFilters (la página se lo pasa por props).
//
// TAREAS:
//   [x] Pestañas con el mismo diseño que UserFiltersBar (role="tablist", aria-selected)
//   [x] Usar BRAND_STATUS_TABS (model/brands.constants.ts)
//   [x] Búsqueda con el componente <Input>, ícono <Search> de lucide a la izquierda
//       (className="pl-9"), placeholder "Buscar marca por nombre..."
//   [x] aria-label en el input de búsqueda
//
// NO CAMBIAR: las props (BrandFiltersBarProps en model/brands.types.ts)
// REFERENCIA: features/users/components/UserFiltersBar.tsx (sin el select de rol)
// =====================================================================
import { Search } from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { BRAND_STATUS_TABS } from "../model/brands.constants";
import type { BrandFiltersBarProps } from "../model/brands.types";

export function BrandFiltersBar({ status, onStatusChange, search, onSearchChange }: BrandFiltersBarProps) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            {/* Activas / Inactivas */}
            <div className="inline-flex rounded-lg bg-zinc-100 p-1" role="tablist" aria-label="Estado de las marcas">
                {BRAND_STATUS_TABS.map((tab) => (
                    <button
                        key={tab.value}
                        id={`brands-tab-${tab.value}`}
                        type="button"
                        role="tab"
                        aria-selected={status === tab.value}
                        onClick={() => onStatusChange(tab.value)}
                        className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                            status === tab.value ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Búsqueda por nombre */}
            <div className="relative md:w-72">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                    id="brands-search"
                    type="search"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Buscar marca por nombre..."
                    aria-label="Buscar marcas por nombre"
                    className="pl-9"
                />
            </div>
        </div>
    );
}