// src/features/categories/components/CreateCategoryButton.tsx
// Botón "+ Nueva categoría". Abre CategoryFormModal en modo "create".
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { CategoryFormModal } from "./CategoryFormModal";
import type { CreateCategoryButtonProps } from "../model/categories.types";

export function CreateCategoryButton({ onCreated }: CreateCategoryButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button type="button" onClick={() => setIsOpen(true)}>
                <Plus className="h-4 w-4" />
                Nueva categoría
            </Button>

            <CategoryFormModal mode="create" isOpen={isOpen} onClose={() => setIsOpen(false)} onSuccess={onCreated} />
        </>
    );
}
