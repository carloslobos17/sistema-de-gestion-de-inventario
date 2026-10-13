import { BrandStatusButton } from "./BrandStatusButton";
import { EditBrandButton } from "./EditBrandButton";
import type { BrandTableProps } from "../model/brands.types";

export function BrandTable({ brands, onBrandSaved, onBrandStatusChanged }: BrandTableProps) {
    return (
        <ul className="divide-y rounded-lg border bg-white">
            {brands.map((brand) => (
                <li key={brand.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                    <span>
                        {brand.name} — {brand.is_active ? "Activa" : "Inactiva"}
                    </span>
                    <span className="flex gap-2">
                        <EditBrandButton brand={brand} onSaved={onBrandSaved} />
                        <BrandStatusButton brand={brand} onChanged={onBrandStatusChanged} />
                    </span>
                </li>
            ))}
        </ul>
    );
}
