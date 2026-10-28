// src/features/suppliers/components/SupplierStatusButton.tsx
// Botón Desactivar/Reactivar de cada fila. Abre el ConfirmModal y usa useSupplierStatus.
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";
import { useSupplierStatus } from "../hooks/useSupplierStatus";
import type { SupplierStatusButtonProps } from "../model/suppliers.types";

export function SupplierStatusButton({ supplier, onChanged }: SupplierStatusButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { toggleSupplierStatus, isSaving } = useSupplierStatus();

    const handleConfirm = async () => {
        const result = await toggleSupplierStatus(supplier);

        // "=== false" para que TypeScript sepa que aquí existe result.error
        if (result.ok === false) {
            toast.error(result.error); // el modal sigue abierto
            return;
        }

        toast.success(
            supplier.is_active ? `Proveedor ${supplier.name} desactivado` : `Proveedor ${supplier.name} reactivado`
        );
        setIsOpen(false);
        onChanged({ ...supplier, is_active: !supplier.is_active });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={`rounded px-2 py-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                    supplier.is_active
                        ? "text-rose-600 hover:bg-rose-50 focus-visible:ring-rose-500"
                        : "text-emerald-600 hover:bg-emerald-50 focus-visible:ring-emerald-500"
                }`}
            >
                {supplier.is_active ? "Desactivar" : "Reactivar"}
            </button>

            <ConfirmModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={handleConfirm}
                isLoading={isSaving}
                variant={supplier.is_active ? "danger" : "primary"}
                title={supplier.is_active ? "Desactivar proveedor" : "Reactivar proveedor"}
                description={
                    supplier.is_active ? (
                        <>
                            ¿Desactivar el proveedor <strong>{supplier.name}</strong>? Ya no aparecerá al registrar
                            compras nuevas.
                        </>
                    ) : (
                        <>
                            ¿Reactivar el proveedor <strong>{supplier.name}</strong>?
                        </>
                    )
                }
                confirmText={supplier.is_active ? "Sí, desactivar" : "Sí, reactivar"}
            />
        </>
    );
}
