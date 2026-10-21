import { useState } from "react";
import { BrandFormModal } from "./BrandFormModal";
import type { EditBrandButtonProps } from "../model/brands.types";

export function EditBrandButton({ brand, onSaved }: EditBrandButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="rounded px-2 py-1 font-medium text-blue-600 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
                Editar
            </button>

            <BrandFormModal mode="edit" brand={brand} isOpen={isOpen} onClose={() => setIsOpen(false)} onSuccess={onSaved} />
        </>
    );
}
