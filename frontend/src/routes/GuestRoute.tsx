// src/routes/GuestRoute.tsx
// Solo para quien NO tiene sesión (el login). Con sesión activa lleva a la página
// que quería abrir antes del login, o al dashboard.
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthSession } from "../features/auth/hooks/useAuthSession";
import { SessionLoadingScreen } from "../features/auth/components/SessionLoadingScreen";
import type { LoginRedirectState } from "./routes.types";

export function GuestRoute() {
    const { status } = useAuthSession();
    const location = useLocation();

    if (status === "loading") return <SessionLoadingScreen />;

    if (status === "authenticated") {
        const from = (location.state as LoginRedirectState | null)?.from;
        const target = from ? `${from.pathname}${from.search ?? ""}` : "/dashboard";
        return <Navigate to={target} replace />;
    }

    return <Outlet />;
}
