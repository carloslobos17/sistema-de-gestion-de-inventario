// src/features/brands/components/BrandStatusButton.tsx
// Botón Desactivar/Reactivar de cada fila. Abre el ConfirmModal y usa useBrandStatus.
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";
import { useBrandStatus } from "../hooks/useBrandStatus";
import type { BrandStatusButtonProps } from "../model/brands.types";

export function BrandStatusButton({ brand, onChanged }: BrandStatusButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { toggleBrandStatus, isSaving } = useBrandStatus();

    const handleConfirm = async () => {
        const result = await toggleBrandStatus(brand);
        if (result.ok === false) {
            toast.error(result.error);
            return;
        }
        toast.success(brand.is_active ? `Marca ${brand.name} desactivada` : `Marca ${brand.name} reactivada`);
        setIsOpen(false);
        onChanged({ ...brand, is_active: !brand.is_active });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={`rounded px-2 py-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 ${brand.is_active
                    ? "text-rose-600 hover:bg-rose-50 focus-visible:ring-rose-500"
                    : "text-emerald-600 hover:bg-emerald-50 focus-visible:ring-emerald-500"
                    }`}
            >
                {brand.is_active ? "Desactivar" : "Reactivar"}
            </button>

            <ConfirmModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={handleConfirm}
                isLoading={isSaving}
                variant={brand.is_active ? "danger" : "primary"}
                title={brand.is_active ? "Desactivar marca" : "Reactivar marca"}
                description={
                    brand.is_active ? (
                        <>
                            ¿Desactivar la marca <strong>{brand.name}</strong>? Ya no aparecerá al registrar productos nuevos.
                        </>
                    ) : (
                        <>
                            ¿Reactivar la marca <strong>{brand.name}</strong>?
                        </>
                    )
                }
                confirmText={brand.is_active ? "Sí, desactivar" : "Sí, reactivar"}
            />
        </>
    );
}