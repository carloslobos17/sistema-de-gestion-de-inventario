// =====================================================================
// H1 · Ver y buscar marcas — Integrante 1
// Archivo: features/brands/pages/BrandsListPage.tsx
// ---------------------------------------------------------------------
// QUÉ ES: la única página del módulo (/inventory/brands). Junta los
// filtros, la tabla y el botón "+ Nueva marca".
//
// YA ESTÁ CONECTADO (no cambiar estas conexiones, H2 y H3 dependen de ellas):
//   - <CreateBrandButton onCreated={...} />   → de H2, va en el PageHeader
//   - <BrandTable onBrandSaved / onBrandStatusChanged />
//
// TAREAS:
//   [x] Mostrar "Cargando marcas..." con <Loader2> solo en la primera carga
//   [x] Mostrar el error de carga en un recuadro rojo (como UsersListPage)
//   [x] Mostrar el mensaje vacío (emptyMessage) cuando no hay marcas
//   [x] Al cambiar filtros, dejar la tabla visible pero atenuada (opacity-60)
//
// REFERENCIA: features/users/pages/UsersListPage.tsx (misma estructura)
// =====================================================================
import { Loader2 } from "lucide-react";
import { PageHeader } from "../../../components/layout/PageHeader";
import { BrandFiltersBar } from "../components/BrandFiltersBar";
import { BrandTable } from "../components/BrandTable";
import { CreateBrandButton } from "../components/CreateBrandButton";
import { useBrandFilters } from "../hooks/useBrandFilters";
import { useBrandsList } from "../hooks/useBrandsList";

export function BrandsListPage() {
    const { status, setStatus, search, setSearch, filters, emptyMessage } = useBrandFilters();
    const { brands, isLoading, error, reload, removeBrandFromList, replaceBrandInList } = useBrandsList(filters);

    // "Cargando..." solo en la primera carga; después la tabla se queda visible (atenuada)
    const isFirstLoad = isLoading && brands.length === 0;

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <PageHeader
                title="Marcas"
                description="Administra las marcas de los productos del inventario."
                action={<CreateBrandButton onCreated={() => reload()} />}
            />

            <BrandFiltersBar status={status} onStatusChange={setStatus} search={search} onSearchChange={setSearch} />

            {/* Error al cargar la lista */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">{error}</div>
            )}

            {/* Contenido */}
            {isFirstLoad ? (
                <div className="flex items-center justify-center gap-2 py-12 text-sm text-zinc-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Cargando marcas...
                </div>
            ) : !error && !isLoading && brands.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center shadow-sm">
                    <p className="text-sm text-zinc-500">{emptyMessage}</p>
                </div>
            ) : brands.length > 0 ? (
                // Al cambiar filtros la tabla se queda visible (atenuada) en vez de parpadear
                <div className={`transition-opacity ${isLoading ? "opacity-60" : ""}`} aria-busy={isLoading}>
                    <BrandTable
                        brands={brands}
                        onBrandSaved={replaceBrandInList}
                        // Al desactivar/reactivar, la marca ya no pertenece a esta pestaña
                        onBrandStatusChanged={(brand) => removeBrandFromList(brand.id)}
                    />
                </div>
            ) : null}
        </div>
    );
}