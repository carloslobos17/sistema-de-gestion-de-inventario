import { useState } from "react";
import { toast } from "sonner";
import type { CustomerStatusButtonProps } from "../model/customers.types";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";
import { useCustomerStatus } from "../hooks/useCustomerStatus";

export function CustomerStatusButton({ customer, onChanged }: CustomerStatusButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toggleCustomerStatus, isSaving } = useCustomerStatus();

    const handleConfirm = async () => {
        const result = await toggleCustomerStatus(customer);
        
        if (result.ok) {
            toast.success(
                customer.is_active
                    ? "Cliente desactivado exitosamente"
                    : "Cliente reactivado exitosamente"
            );
            setIsModalOpen(false);
            
            if (onChanged) {
                onChanged({ ...customer, is_active: !customer.is_active });
            }
        } else {
            toast.error(result.error);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className={`rounded px-2 py-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                    customer.is_active
                        ? "text-rose-600 hover:bg-rose-50 focus-visible:ring-rose-500"
                        : "text-emerald-600 hover:bg-emerald-50 focus-visible:ring-emerald-500"
                }`}
            >
                {customer.is_active ? "Desactivar" : "Reactivar"}
            </button>

            <ConfirmModal
                isOpen={isModalOpen}
                title={
                    customer.is_active 
                        ? "¿Desactivar cliente?" 
                        : `¿Reactivar el cliente?`
                }
                description={
                    customer.is_active ? (
                        <>
                            <strong>{customer.name}</strong> ya no aparecerá al registrar ventas. 
                            Podrás reactivarlo desde la pestaña Inactivos.
                        </>
                    ) : (
                        <><strong>{customer.name} </strong> volverá a estar disponible para el registro de ventas y consultas.</>
                    )
                }
                confirmText={customer.is_active ? "Sí, desactivar" : "Sí, reactivar"}
                variant={customer.is_active ? "danger" : "primary"}
                isLoading={isSaving}
                onConfirm={handleConfirm}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}