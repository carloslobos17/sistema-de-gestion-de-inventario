// src/features/categories/components/CategoryStatusButton.tsx
// Botón Desactivar/Reactivar de cada fila. Abre el ConfirmModal y usa useCategoryStatus.
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";
import { useCategoryStatus } from "../hooks/useCategoryStatus";
import type { CategoryStatusButtonProps } from "../model/categories.types";

export function CategoryStatusButton({ category, onChanged }: CategoryStatusButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { toggleCategoryStatus, isSaving } = useCategoryStatus();

    const handleConfirm = async () => {
        const result = await toggleCategoryStatus(category);

        // "=== false" para que TypeScript sepa que aquí existe result.error
        if (result.ok === false) {
            toast.error(result.error); // el modal sigue abierto
            return;
        }

        toast.success(
            category.is_active ? `Categoría ${category.name} desactivada` : `Categoría ${category.name} reactivada`
        );
        setIsOpen(false);
        onChanged({ ...category, is_active: !category.is_active });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={`rounded px-2 py-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                    category.is_active
                        ? "text-rose-600 hover:bg-rose-50 focus-visible:ring-rose-500"
                        : "text-emerald-600 hover:bg-emerald-50 focus-visible:ring-emerald-500"
                }`}
            >
                {category.is_active ? "Desactivar" : "Reactivar"}
            </button>

            <ConfirmModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={handleConfirm}
                isLoading={isSaving}
                variant={category.is_active ? "danger" : "primary"}
                title={category.is_active ? "Desactivar categoría" : "Reactivar categoría"}
                description={
                    category.is_active ? (
                        <>
                            ¿Desactivar la categoría <strong>{category.name}</strong>? Ya no aparecerá al registrar
                            productos nuevos.
                        </>
                    ) : (
                        <>
                            ¿Reactivar la categoría <strong>{category.name}</strong>?
                        </>
                    )
                }
                confirmText={category.is_active ? "Sí, desactivar" : "Sí, reactivar"}
            />
        </>
    );
}
