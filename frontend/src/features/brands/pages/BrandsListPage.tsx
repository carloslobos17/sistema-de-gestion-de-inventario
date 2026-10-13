import { PageHeader } from "../../../components/layout/PageHeader";
import { BrandFiltersBar } from "../components/BrandFiltersBar";
import { BrandTable } from "../components/BrandTable";
import { CreateBrandButton } from "../components/CreateBrandButton";
import { useBrandFilters } from "../hooks/useBrandFilters";
import { useBrandsList } from "../hooks/useBrandsList";

export function BrandsListPage() {
    const { status, setStatus, search, setSearch, filters } = useBrandFilters();
    const { brands, reload, removeBrandFromList, replaceBrandInList } = useBrandsList(filters);

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <PageHeader
                title="Marcas"
                description="Administra las marcas de los productos del inventario."
                action={<CreateBrandButton onCreated={() => reload()} />}
            />

            <BrandFiltersBar status={status} onStatusChange={setStatus} search={search} onSearchChange={setSearch} />

            {/* TODO H1: estados de carga, error y vacío (ver TAREAS arriba) */}

            <BrandTable
                brands={brands}
                onBrandSaved={replaceBrandInList}
                // Al desactivar/reactivar, la marca ya no pertenece a esta pestaña
                onBrandStatusChanged={(brand) => removeBrandFromList(brand.id)}
            />
        </div>
    );
}
