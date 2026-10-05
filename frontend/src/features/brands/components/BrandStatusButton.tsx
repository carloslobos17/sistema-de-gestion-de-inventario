// =====================================================================
// H3 · Desactivar y reactivar una marca — Integrante 3
// Archivo: features/brands/components/BrandStatusButton.tsx
// ---------------------------------------------------------------------
// QUÉ HACE: botón "Desactivar" (marca activa) o "Reactivar" (marca inactiva) de cada fila.
// Al hacer clic abre el ConfirmModal que YA EXISTE (components/ui/ConfirmModal.tsx).
// Tu trabajo es la lógica y pasarle los datos correctos al modal.
//
// TAREAS:
//   [ ] Estado isOpen para abrir/cerrar el ConfirmModal
//   [ ] Inyectar al <ConfirmModal> según brand.is_active:
//         activa   → variant="danger",  title="Desactivar marca",
//                    description="¿Desactivar la marca <strong>X</strong>? Ya no aparecerá
//                    al registrar productos nuevos.", confirmText="Sí, desactivar"
//         inactiva → variant="primary", title="Reactivar marca",
//                    description="¿Reactivar la marca <strong>X</strong>?", confirmText="Sí, reactivar"
//   [ ] isLoading={isSaving} (de useBrandStatus) para el spinner y que no se pueda cerrar
//   [ ] onConfirm: llamar toggleBrandStatus(brand)
//         - si result.ok === false → toast.error(result.error) (ej. 403 sin permiso) y dejar el modal abierto
//         - si ok → toast.success("Marca X desactivada" / "reactivada"), cerrar el modal y
//           llamar onChanged({ ...brand, is_active: !brand.is_active })
//   [ ] Estilo del botón como en UserTable: rojo para Desactivar, verde para Reactivar
//
// REUTILIZA: ConfirmModal (NO lo modifiques), toast (sonner)
// NO CAMBIAR: las props (BrandStatusButtonProps). La tabla ya lo usa así.
// REFERENCIA: el ConfirmModal de features/users/components/UserTable.tsx
// =====================================================================
import type { BrandStatusButtonProps } from "../model/brands.types";

export function BrandStatusButton(props: BrandStatusButtonProps) {
    // TODO H3: abrir ConfirmModal y ejecutar la acción (ver TAREAS arriba)
    return <button type="button">{props.brand.is_active ? "Desactivar" : "Reactivar"}</button>;
}
