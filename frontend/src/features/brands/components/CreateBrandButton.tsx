// =====================================================================
// H2 · Crear y editar una marca — Integrante 2
// Archivo: features/brands/components/CreateBrandButton.tsx
// ---------------------------------------------------------------------
// QUÉ HACE: botón "+ Nueva marca" del encabezado. Abre BrandFormModal en modo "create".
// Ya está completo: solo abre/cierra el modal. Todo el trabajo va en BrandFormModal.
//
// TAREAS:
//   [ ] Revisar que el botón use <Button> (ya lo hace) y se vea bien en el PageHeader
//
// NO CAMBIAR: las props (CreateBrandButtonProps). La página ya lo usa así.
// =====================================================================
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { BrandFormModal } from "./BrandFormModal";
import type { CreateBrandButtonProps } from "../model/brands.types";

export function CreateBrandButton({ onCreated }: CreateBrandButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button type="button" onClick={() => setIsOpen(true)}>
                <Plus className="h-4 w-4" />
                Nueva marca
            </Button>

            <BrandFormModal mode="create" isOpen={isOpen} onClose={() => setIsOpen(false)} onSuccess={onCreated} />
        </>
    );
}
