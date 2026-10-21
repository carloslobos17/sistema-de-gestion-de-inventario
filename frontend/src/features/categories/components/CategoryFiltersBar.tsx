// src/features/categories/components/CategoryFiltersBar.tsx
// Pestañas Activas/Inactivas y búsqueda por nombre. Solo dibuja: el estado vive en useCategoryFilters.
import { Search } from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { CATEGORY_STATUS_TABS } from "../model/categories.constants";
import type { CategoryFiltersBarProps } from "../model/categories.types";

export function CategoryFiltersBar({ status, onStatusChange, search, onSearchChange }: CategoryFiltersBarProps) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            {/* Activas / Inactivas */}
            <div className="inline-flex rounded-lg bg-zinc-100 p-1" role="tablist" aria-label="Estado de las categorías">
                {CATEGORY_STATUS_TABS.map((tab) => (
                    <button
                        key={tab.value}
                        id={`categories-tab-${tab.value}`}
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
                    id="categories-search"
                    type="search"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Buscar categoría por nombre..."
                    aria-label="Buscar categorías por nombre"
                    className="pl-9"
                />
            </div>
        </div>
    );
}