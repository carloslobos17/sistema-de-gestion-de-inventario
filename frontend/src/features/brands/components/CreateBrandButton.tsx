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
