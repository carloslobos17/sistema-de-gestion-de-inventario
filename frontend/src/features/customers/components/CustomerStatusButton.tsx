// src/features/customers/components/CustomerStatusButton.tsx
// 👤 DUEÑO: Persona 3
// Botón "Desactivar" / "Reactivar" de cada fila. Solo se muestra con permiso (lo decide CustomerTable).
//
// TODO (Persona 3):
//   [ ] Abrir <ConfirmModal> (src/components/ui/ConfirmModal.tsx) al hacer clic.
//       Desactivar: título "¿Desactivar cliente?", texto "<nombre> ya no aparecerá al registrar ventas.
//       Podrás reactivarlo desde la pestaña Inactivos.", botón "Sí, desactivar" (variant "danger").
//       Reactivar: "¿Reactivar el cliente <nombre>?", botón "Sí, reactivar" (variant "primary").
//   [ ] Al confirmar: useCustomerStatus().toggleCustomerStatus(customer).
//       Error → toast.error y el modal sigue abierto. Éxito → toast.success("Cliente desactivado/reactivado"),
//       cerrar el modal y llamar onChanged({ ...customer, is_active: !customer.is_active }).
//   Referencia: src/features/suppliers/components/SupplierStatusButton.tsx
import { toast } from "sonner";
import type { CustomerStatusButtonProps } from "../model/customers.types";

export function CustomerStatusButton({ customer }: CustomerStatusButtonProps) {
    return (
        <button
            type="button"
            onClick={() => toast.info("Pendiente: desactivar/reactivar (CustomerStatusButton)")}
            className={`rounded px-2 py-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                customer.is_active
                    ? "text-rose-600 hover:bg-rose-50 focus-visible:ring-rose-500"
                    : "text-emerald-600 hover:bg-emerald-50 focus-visible:ring-emerald-500"
            }`}
        >
            {customer.is_active ? "Desactivar" : "Reactivar"}
        </button>
    );
}
