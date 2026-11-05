// src/features/customers/components/CustomerFiltersBar.tsx
// Pestañas Activos/Inactivos, tipo de cliente y búsqueda. Solo dibuja: el estado vive en useCustomerFilters.
import { Search } from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { CUSTOMER_STATUS_TABS, CUSTOMER_TYPE_FILTER_OPTIONS } from "../model/customers.constants";
import type { CustomerFiltersBarProps, CustomerTypeFilter } from "../model/customers.types";

export function CustomerFiltersBar({
    status,
    onStatusChange,
    customerType,
    onCustomerTypeChange,
    search,
    onSearchChange,
}: CustomerFiltersBarProps) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            {/* Activos / Inactivos */}
            <div className="inline-flex self-start rounded-lg bg-zinc-100 p-1" role="tablist" aria-label="Estado de los clientes">
                {CUSTOMER_STATUS_TABS.map((tab) => (
                    <button
                        key={tab.value}
                        id={`customers-tab-${tab.value}`}
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

            <div className="flex flex-col gap-3 sm:flex-row md:items-center">
                {/* Tipo de cliente */}
                <div className="sm:w-48">
                    <Select
                        id="customers-type"
                        aria-label="Filtrar por tipo de cliente"
                        value={customerType}
                        onChange={(e) => onCustomerTypeChange(e.target.value as CustomerTypeFilter)}
                    >
                        {CUSTOMER_TYPE_FILTER_OPTIONS.map((option) => (
                            <option key={option.value || "all"} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>
                </div>

                {/* Búsqueda */}
                <div className="relative md:w-96">
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <Input
                        id="customers-search"
                        type="search"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Nombre, documento, NRC o teléfono..."
                        title="Busca por nombre, nombre comercial, documento, NRC, teléfono o correo"
                        aria-label="Buscar clientes"
                        className="pl-9"
                    />
                </div>
            </div>
        </div>
    );
}
