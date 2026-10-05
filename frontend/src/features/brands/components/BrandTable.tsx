// =====================================================================
// H1 · Ver y buscar marcas — Integrante 1
// Archivo: features/brands/components/BrandTable.tsx
// ---------------------------------------------------------------------
// QUÉ HACE: dibuja la tabla de marcas. En la columna "Acciones" monta los botones
// de H2 (EditBrandButton) y H3 (BrandStatusButton). Esos botones ya traen su propio
// modal: la tabla NO abre modales ni llama al backend.
//
// ESTADO ACTUAL: lista mínima sin estilos (para que H2 y H3 puedan probar).
//
// TAREAS:
//   [ ] Tabla con el mismo diseño que UserTable (thead, filas con hover, bordes)
//   [ ] Columnas: Nombre · Estado · Acciones
//   [ ] Estado con <Badge variant="success" | "danger"> ("Activa" / "Inactiva")
//   [ ] Mantener los dos botones de acciones tal como están conectados
//
// NO CAMBIAR: las props (BrandTableProps) ni cómo se conectan EditBrandButton y
// BrandStatusButton (onSaved / onChanged).
// REFERENCIA: features/users/components/UserTable.tsx
// =====================================================================
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
