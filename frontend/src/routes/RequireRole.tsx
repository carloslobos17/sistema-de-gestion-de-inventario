// src/routes/RequireRole.tsx
// Igual que ProtectedRoute, pero además revisa el rol.
// Si el usuario no tiene permiso, lo manda al dashboard (aunque escriba la URL a mano).
import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "../features/auth/hooks/useCurrentUser";
import { hasAnyRole } from "../features/auth/auth.roles";
import type { RequireRoleProps } from "./routes.types";

export function RequireRole({ allowedRoles, redirectTo = "/dashboard" }: RequireRoleProps) {
    const currentUser = useCurrentUser();

    return hasAnyRole(currentUser?.role_id, allowedRoles) ? <Outlet /> : <Navigate to={redirectTo} replace />;
}