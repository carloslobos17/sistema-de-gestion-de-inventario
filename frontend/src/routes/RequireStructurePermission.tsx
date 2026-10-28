// src/routes/RequireStructurePermission.tsx
// Igual que RequireRole, pero revisa el permiso can_manage_structure del rol.
// Protege las páginas de crear/editar catálogos aunque alguien escriba la URL a mano.
// (La seguridad real sigue siendo el 403 del backend.)
import { Navigate, Outlet } from "react-router-dom";
import { useCanManageStructure } from "../features/auth/hooks/useCanManageStructure";
import type { RequireStructurePermissionProps } from "./routes.types";

export function RequireStructurePermission({ redirectTo = "/dashboard" }: RequireStructurePermissionProps) {
    const canManage = useCanManageStructure();

    return canManage ? <Outlet /> : <Navigate to={redirectTo} replace />;
}
