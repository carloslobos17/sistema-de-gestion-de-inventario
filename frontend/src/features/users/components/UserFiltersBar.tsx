// src/features/users/components/UserFiltersBar.tsx
import { Search } from "lucide-react";
import { ROLE_OPTIONS, STATUS_TABS } from "../model/users.constants";
import type { UserStatusTab } from "../model/users.types";

export interface UserFiltersBarProps {
    status: UserStatusTab;
    onStatusChange: (status: UserStatusTab) => void;
    search: string;
    onSearchChange: (search: string) => void;
    roleId: number | undefined;
    onRoleChange: (value: string) => void;
}

export function UserFiltersBar({
    status,
    onStatusChange,
    search,
    onSearchChange,
    roleId,
    onRoleChange,
}: UserFiltersBarProps) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            {/* Activos / Inactivos */}
            <div className="inline-flex rounded-lg bg-zinc-100 p-1" role="tablist" aria-label="Estado de los usuarios">
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab.value}
                        id={`users-tab-${tab.value}`}
                        type="button"
                        role="tab"
                        aria-selected={status === tab.value}
                        onClick={() => onStatusChange(tab.value)}
                        className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${status === tab.value ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                {/* Búsqueda */}
                <div className="relative sm:w-72">
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                        id="users-search"
                        type="search"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar por nombre o usuario..."
                        aria-label="Buscar usuarios"
                        className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50/30 pr-3 pl-9 text-sm focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 focus:outline-none"
                    />
                </div>

                {/* Rol */}
                <select
                    id="users-role-filter"
                    value={roleId ?? ""}
                    onChange={(e) => onRoleChange(e.target.value)}
                    aria-label="Filtrar por rol"
                    className="h-10 rounded-lg border border-zinc-200 bg-zinc-50/30 px-3 text-sm text-zinc-900 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 focus:outline-none"
                >
                    <option value="">Todos los roles</option>
                    {ROLE_OPTIONS.map((role) => (
                        <option key={role.value} value={role.value}>
                            {role.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}