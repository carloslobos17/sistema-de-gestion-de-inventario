// src/features/suppliers/pages/SuppliersListPage.tsx
// Página /suppliers: filtros, tabla paginada y botón "+ Nuevo proveedor" (va a la página de creación).
import { Link } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Pagination } from "../../../components/ui/Pagination";
import { useCanManageStructure } from "../../auth/hooks/useCanManageStructure";
import { SupplierFiltersBar } from "../components/SupplierFiltersBar";
import { SupplierTable } from "../components/SupplierTable";
import { useSupplierFilters } from "../hooks/useSupplierFilters";
import { useSuppliersList } from "../hooks/useSuppliersList";

export function SuppliersListPage() {
    const { status, setStatus, search, setSearch, setPage, filters, emptyMessage } = useSupplierFilters();
    const { suppliers, meta, isLoading, error, reload, removeSupplierFromList } = useSuppliersList(filters, setPage);

    // Sin permiso (ej. vendedor): ve la lista, pero sin "+ Nuevo proveedor", Editar ni Desactivar
    const canManage = useCanManageStructure();

    // "Cargando..." solo en la primera carga; después la tabla se queda visible (atenuada)
    const isFirstLoad = isLoading && suppliers.length === 0;
    // La página quedó vacía (ej. se desactivó su único proveedor): el hook ya está yendo a la anterior
    const isLeavingEmptyPage = meta !== null && meta.page > Math.max(meta.totalPages, 1);

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <PageHeader
                title="Proveedores"
                description="Administra las empresas que le venden a la ferretería."
                action={
                    canManage ? (
                        <Link
                            to="/suppliers/create"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                        >
                            <Plus className="h-4 w-4" />
                            Nuevo proveedor
                        </Link>
                    ) : undefined
                }
            />

            <SupplierFiltersBar status={status} onStatusChange={setStatus} search={search} onSearchChange={setSearch} />

            {/* Error al cargar la lista */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">{error}</div>
            )}

            {/* Contenido */}
            {isFirstLoad ? (
                <div className="flex items-center justify-center gap-2 py-12 text-sm text-zinc-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Cargando proveedores...
                </div>
            ) : !error && !isLoading && !isLeavingEmptyPage && suppliers.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center shadow-sm">
                    <p className="text-sm text-zinc-500">{emptyMessage}</p>
                </div>
            ) : suppliers.length > 0 ? (
                // Al cambiar filtros la tabla se queda visible (atenuada) en vez de parpadear
                <div className={`space-y-4 transition-opacity ${isLoading ? "opacity-60" : ""}`} aria-busy={isLoading}>
                    <SupplierTable
                        suppliers={suppliers}
                        canManage={canManage}
                        // Al desactivar/reactivar ya no pertenece a esta pestaña: se quita al instante
                        // y se recarga para rellenar la página y actualizar el total
                        onSupplierStatusChanged={(supplier) => {
                            removeSupplierFromList(supplier.id);
                            reload();
                        }}
                    />

                    {meta && <Pagination meta={meta} onPageChange={setPage} isLoading={isLoading} itemLabel="proveedores" />}
                </div>
            ) : null}
        </div>
    );
}
