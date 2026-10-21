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

    const isFirstLoad = isLoading && brands.length === 0;

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <PageHeader
                title="Marcas"
                description="Administra las marcas de los productos del inventario."
                action={<CreateBrandButton onCreated={() => reload()} />}
            />

            <BrandFiltersBar status={status} onStatusChange={setStatus} search={search} onSearchChange={setSearch} />


            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">{error}</div>
            )}

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

                <div className={`transition-opacity ${isLoading ? "opacity-60" : ""}`} aria-busy={isLoading}>
                    <BrandTable
                        brands={brands}
                        onBrandSaved={replaceBrandInList}
                        onBrandStatusChanged={(brand) => removeBrandFromList(brand.id)}
                    />
                </div>
            ) : null}
        </div>
    );
}