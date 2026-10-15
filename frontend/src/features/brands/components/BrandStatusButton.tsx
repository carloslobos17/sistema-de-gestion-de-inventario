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
        if (!result.ok) {
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
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${brand.is_active
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
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