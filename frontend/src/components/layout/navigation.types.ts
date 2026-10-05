// src/components/layout/navigation.types.ts
import type { LucideIcon } from "lucide-react";

export interface NavLinkItem {
    label: string;
    description: string;
    to?: string;
    icon: LucideIcon;
    colorClass?: string; // color del cuadro del ícono (por defecto azul)
    action?: "logout"; // ítems que ejecutan una acción en vez de navegar
    roles?: readonly number[]; // roles que pueden verlo; sin roles = todos los usuarios con sesión
}

export interface NavGroup {
    label: string;
    items: NavLinkItem[];
}

export interface MegaMenuItemProps {
    item: NavLinkItem;
    isActive: boolean;
    onLogout: () => void;
}
