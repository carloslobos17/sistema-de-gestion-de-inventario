// src/components/layout/navigation.utils.ts
import { hasAnyRole } from "../../features/auth/auth.roles";
import type { NavGroup } from "./navigation.types";

// Deja solo los ítems que el rol puede ver, y quita los grupos que quedan vacíos
export function filterNavGroupsByRole(groups: NavGroup[], roleId: number | undefined): NavGroup[] {
    return groups
        .map((group) => ({
            ...group,
            items: group.items.filter((item) => hasAnyRole(roleId, item.roles)),
        }))
        .filter((group) => group.items.length > 0);
}
