// =====================================================================
// H1 · Ver y buscar marcas — Integrante 1
// Archivo: features/brands/components/BrandTable.tsx
// ---------------------------------------------------------------------
// QUÉ HACE: dibuja la tabla de marcas. En la columna "Acciones" monta los botones
// de H2 (EditBrandButton) y H3 (BrandStatusButton). Esos botones ya traen su propio
// modal: la tabla NO abre modales ni llama al backend.
//
// TAREAS:
//   [x] Tabla con el mismo diseño que UserTable (thead, filas con hover, bordes)
//   [x] Columnas: Nombre · Estado · Acciones
//   [x] Estado con <Badge variant="success" | "danger"> ("Activa" / "Inactiva")
//   [x] Mantener los dos botones de acciones tal como están conectados
//
// NO CAMBIAR: las props (BrandTableProps) ni cómo se conectan EditBrandButton y
// BrandStatusButton (onSaved / onChanged).
// REFERENCIA: features/users/components/UserTable.tsx
// =====================================================================
import { Badge } from "../../../components/ui/Badge";
import { BrandStatusButton } from "./BrandStatusButton";
import { EditBrandButton } from "./EditBrandButton";
import type { BrandTableProps } from "../model/brands.types";

export function BrandTable({ brands, onBrandSaved, onBrandStatusChanged }: BrandTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
                    <tr>
                        <th scope="col" className="px-6 py-3">Nombre</th>
                        <th scope="col" className="px-6 py-3">Estado</th>
                        <th scope="col" className="px-6 py-3 text-right">Acciones</th>
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
                            <td className="px-6 py-4">
                                <div className="flex justify-end gap-1">
                                    <EditBrandButton brand={brand} onSaved={onBrandSaved} />
                                    <BrandStatusButton brand={brand} onChanged={onBrandStatusChanged} />
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}