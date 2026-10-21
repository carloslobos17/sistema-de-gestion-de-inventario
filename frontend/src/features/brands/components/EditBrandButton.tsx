// =====================================================================
// H2 · Crear y editar una marca — Integrante 2
// Archivo: features/brands/components/EditBrandButton.tsx
// ---------------------------------------------------------------------
// QUÉ HACE: botón "Editar" de cada fila de la tabla. Abre BrandFormModal en modo "edit"
// con la marca de esa fila. Ya está completo: todo el trabajo va en BrandFormModal.
//
// TAREAS:
//   [x] Dar al botón el estilo de acción de fila que usa UserTable ("Editar" en azul)
//
// NO CAMBIAR: las props (EditBrandButtonProps). La tabla ya lo usa así.
// =====================================================================
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
