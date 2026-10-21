import { Badge } from "../../../components/ui/Badge";
import { BrandStatusButton } from "./BrandStatusButton";
import { EditBrandButton } from "./EditBrandButton";
import type { BrandTableProps } from "../model/brands.types";

export function BrandTable({ brands, onBrandSaved, onBrandStatusChanged, canManage }: BrandTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nombre</th>
                            <th scope="col" className="px-6 py-3">Estado</th>
                            {canManage && <th scope="col" className="px-6 py-3 text-right">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {brands.map((brand) => (
                            <tr key={brand.id} className="transition-colors hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{brand.name}</td>
                                <td className="px-6 py-4">
                                    <Badge variant={brand.is_active ? "success" : "danger"}>
                                        {brand.is_active ? "Activa" : "Inactiva"}
                                    </Badge>
                                </td>
                                {canManage && (
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-1">
                                            <EditBrandButton brand={brand} onSaved={onBrandSaved} />
                                            <BrandStatusButton brand={brand} onChanged={onBrandStatusChanged} />
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}