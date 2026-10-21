// src/features/categories/pages/CategoriesListPage.tsx
// Página /inventory/categories: filtros, tabla paginada y botón "+ Nueva categoría".
import { Loader2 } from "lucide-react";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Pagination } from "../../../components/ui/Pagination";
import { CategoryFiltersBar } from "../components/CategoryFiltersBar";
import { CategoryTable } from "../components/CategoryTable";
import { CreateCategoryButton } from "../components/CreateCategoryButton";
import { useCategoryFilters } from "../hooks/useCategoryFilters";
import { useCategoriesList } from "../hooks/useCategoriesList";

export function CategoriesListPage() {
    const { status, setStatus, search, setSearch, setPage, filters, emptyMessage } = useCategoryFilters();
    const { categories, meta, isLoading, error, reload, removeCategoryFromList, replaceCategoryInList } =
        useCategoriesList(filters, setPage);

    // "Cargando..." solo en la primera carga; después la tabla se queda visible (atenuada)
    const isFirstLoad = isLoading && categories.length === 0;
    // La página quedó vacía (ej. se desactivó su única categoría): el hook ya está yendo a la anterior
    const isLeavingEmptyPage = meta !== null && meta.page > Math.max(meta.totalPages, 1);

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <PageHeader
                title="Categorías"
                description="Administra las categorías de los productos del inventario."
                action={<CreateCategoryButton onCreated={() => reload()} />}
            />

            <CategoryFiltersBar status={status} onStatusChange={setStatus} search={search} onSearchChange={setSearch} />

            {/* Error al cargar la lista */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">{error}</div>
            )}

            {/* Contenido */}
            {isFirstLoad ? (
                <div className="flex items-center justify-center gap-2 py-12 text-sm text-zinc-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Cargando categorías...
                </div>
            ) : !error && !isLoading && !isLeavingEmptyPage && categories.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center shadow-sm">
                    <p className="text-sm text-zinc-500">{emptyMessage}</p>
                </div>
            ) : categories.length > 0 ? (
                // Al cambiar filtros la tabla se queda visible (atenuada) en vez de parpadear
                <div className={`space-y-4 transition-opacity ${isLoading ? "opacity-60" : ""}`} aria-busy={isLoading}>
                    <CategoryTable
                        categories={categories}
                        onCategorySaved={replaceCategoryInList}
                        // Al desactivar/reactivar ya no pertenece a esta pestaña: se quita al instante
                        // y se recarga para rellenar la página y actualizar el total
                        onCategoryStatusChanged={(category) => {
                            removeCategoryFromList(category.id);
                            reload();
                        }}
                    />

                    {meta && <Pagination meta={meta} onPageChange={setPage} isLoading={isLoading} itemLabel="categorías" />}
                </div>
            ) : null}
        </div>
    );
}