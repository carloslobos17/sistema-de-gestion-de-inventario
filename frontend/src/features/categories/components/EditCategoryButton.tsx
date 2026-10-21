// src/features/categories/components/EditCategoryButton.tsx
// Botón "Editar" de cada fila. Abre CategoryFormModal en modo "edit".
import { useState } from "react";
import { CategoryFormModal } from "./CategoryFormModal";
import type { EditCategoryButtonProps } from "../model/categories.types";

export function EditCategoryButton({ category, onSaved }: EditCategoryButtonProps) {
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

            <CategoryFormModal mode="edit" category={category} isOpen={isOpen} onClose={() => setIsOpen(false)} onSuccess={onSaved} />
        </>
    );
}
