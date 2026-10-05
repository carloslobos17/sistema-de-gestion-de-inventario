// =====================================================================
// H2 · Crear y editar una marca — Integrante 2
// Archivo: features/brands/components/EditBrandButton.tsx
// ---------------------------------------------------------------------
// QUÉ HACE: botón "Editar" de cada fila de la tabla. Abre BrandFormModal en modo "edit"
// con la marca de esa fila. Ya está completo: todo el trabajo va en BrandFormModal.
//
// TAREAS:
//   [ ] Dar al botón el estilo de acción de fila que usa UserTable ("Editar" en azul)
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
            {/* TODO H2: estilo de acción de fila (ver "Editar" en UserTable) */}
            <button type="button" onClick={() => setIsOpen(true)}>
                Editar
            </button>

            <BrandFormModal mode="edit" brand={brand} isOpen={isOpen} onClose={() => setIsOpen(false)} onSuccess={onSaved} />
        </>
    );
}
