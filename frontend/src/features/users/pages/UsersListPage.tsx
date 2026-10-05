// src/features/users/pages/UsersListPage.tsx
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../../components/layout/PageHeader";
import { UserFiltersBar } from "../components/UserFiltersBar";
import { UserTable } from "../components/UserTable";
import { useUserFilters } from "../hooks/useUserFilters";
import { useUsersList } from "../hooks/useUsersList";
import { useUserStatus } from "../hooks/useUserStatus";
import type { UserItem } from "../model/users.types";

export function UsersListPage() {
    const { status, setStatus, search, setSearch, roleId, changeRole, filters, emptyMessage } = useUserFilters();
    const { users, isLoading, error, removeUserFromList } = useUsersList(filters);
    const { toggleUserStatus, isSaving } = useUserStatus();

    // Al desactivar o reactivar, el usuario ya no pertenece a esta pestaña: se quita de la tabla
    const handleToggleStatus = async (user: UserItem) => {
        const result = await toggleUserStatus(user);

        // Se compara con "=== false" para que TypeScript sepa que aquí existe result.error
        if (result.ok === false) {
            toast.error(result.error);
            return;
        }

        removeUserFromList(user.id);
        toast.success(`@${user.username} fue ${user.is_active ? "desactivado" : "reactivado"}`);
    };

    const isFirstLoad = isLoading && users.length === 0;

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <PageHeader
                title="Gestión de Usuarios"
                description="Administra las cuentas de empleados, accesos y permisos al sistema."
                action={
                    <Link
                        to="/users/create"
                        className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 sm:w-auto"
                    >
                        + Nuevo Usuario
                    </Link>
                }
            />

            <UserFiltersBar
                status={status}
                onStatusChange={setStatus}
                search={search}
                onSearchChange={setSearch}
                roleId={roleId}
                onRoleChange={changeRole}
            />

            {/* Error al cargar la lista (los errores de activar/desactivar se muestran como toast) */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">{error}</div>
            )}

            {/* Contenido */}
            {isFirstLoad ? (
                <div className="flex items-center justify-center gap-2 py-12 text-sm text-zinc-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Cargando usuarios...
                </div>
            ) : !error && users.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center shadow-sm">
                    <p className="text-sm text-zinc-500">{emptyMessage}</p>
                </div>
            ) : users.length > 0 ? (
                // Al cambiar filtros la tabla se queda visible (atenuada) en vez de parpadear
                <div className={`transition-opacity ${isLoading ? "opacity-60" : ""}`} aria-busy={isLoading}>
                    <UserTable users={users} onToggleStatus={handleToggleStatus} isProcessing={isSaving} />
                </div>
            ) : null}
        </div>
    );
}