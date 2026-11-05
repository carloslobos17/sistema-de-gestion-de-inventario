// src/features/customers/pages/CustomersListPage.tsx
// Página /customers: filtros, tabla paginada y botón "+ Nuevo cliente".
// El botón lo ven TODOS (el vendedor registra clientes en caja); desactivar/reactivar solo con permiso.
import { Link } from "react-router-dom";
import { Loader2, Plus, Users } from "lucide-react";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Pagination } from "../../../components/ui/Pagination";
import { useCanManageStructure } from "../../auth/hooks/useCanManageStructure";
import { CustomerFiltersBar } from "../components/CustomerFiltersBar";
import { CustomerTable } from "../components/CustomerTable";
import { useCustomerFilters } from "../hooks/useCustomerFilters";
import { useCustomersList } from "../hooks/useCustomersList";

const NEW_CUSTOMER_LINK_CLASSES =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2";

export function CustomersListPage() {
    const {
        status,
        setStatus,
        customerType,
        setCustomerType,
        search,
        setSearch,
        clearSearch,
        hasSearch,
        setPage,
        filters,
        emptyMessage,
    } = useCustomerFilters();
    const { customers, meta, isLoading, error, reload, removeCustomerFromList } = useCustomersList(filters, setPage);

    // Con permiso: Desactivar / Reactivar en cada fila
    const canManage = useCanManageStructure();

    // "Cargando..." solo en la primera carga; después la tabla se queda visible (atenuada)
    const isFirstLoad = isLoading && customers.length === 0;
    // La página quedó vacía (ej. se desactivó su único cliente): el hook ya está yendo a la anterior
    const isLeavingEmptyPage = meta !== null && meta.page > Math.max(meta.totalPages, 1);
    const showEmptyState = !error && !isLoading && !isLeavingEmptyPage && customers.length === 0;

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <PageHeader
                title="Clientes"
                description="Consumidores finales y contribuyentes a los que se les vende."
                action={
                    <Link to="/customers/create" className={NEW_CUSTOMER_LINK_CLASSES}>
                        <Plus className="h-4 w-4" />
                        Nuevo cliente
                    </Link>
                }
            />

            <CustomerFiltersBar
                status={status}
                onStatusChange={setStatus}
                customerType={customerType}
                onCustomerTypeChange={setCustomerType}
                search={search}
                onSearchChange={setSearch}
            />

            {/* Error al cargar la lista */}
            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">{error}</div>}

            {/* Contenido */}
            {isFirstLoad ? (
                <div className="flex items-center justify-center gap-2 py-12 text-sm text-zinc-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Cargando clientes...
                </div>
            ) : showEmptyState ? (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center shadow-sm">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
                        <Users className="h-6 w-6 text-zinc-400" />
                    </span>
                    <p className="text-sm text-zinc-500">{emptyMessage}</p>
                    {hasSearch ? (
                        <button type="button" onClick={clearSearch} className="text-sm font-medium text-blue-600 hover:underline">
                            Limpiar búsqueda
                        </button>
                    ) : (
                        status === "active" &&
                        !customerType && (
                            <Link to="/customers/create" className={NEW_CUSTOMER_LINK_CLASSES}>
                                <Plus className="h-4 w-4" />
                                Nuevo cliente
                            </Link>
                        )
                    )}
                </div>
            ) : customers.length > 0 ? (
                // Al cambiar filtros la tabla se queda visible (atenuada) en vez de parpadear
                <div className={`space-y-4 transition-opacity ${isLoading ? "opacity-60" : ""}`} aria-busy={isLoading}>
                    <CustomerTable
                        customers={customers}
                        canManage={canManage}
                        // Al desactivar/reactivar ya no pertenece a esta pestaña: se quita al instante
                        // y se recarga para rellenar la página y actualizar el total
                        onCustomerStatusChanged={(customer) => {
                            removeCustomerFromList(customer.id);
                            reload();
                        }}
                    />

                    {meta && <Pagination meta={meta} onPageChange={setPage} isLoading={isLoading} itemLabel="clientes" />}
                </div>
            ) : null}
        </div>
    );
}
