// src/routes/ProtectedRoute.tsx
// Exige sesión. Mientras se recupera (F5) muestra "Cargando"; sin sesión manda al login
// recordando la página para volver a ella. Con sesión, vigila la inactividad.
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthSession } from "../features/auth/hooks/useAuthSession";
import { SessionLoadingScreen } from "../features/auth/components/SessionLoadingScreen";
import { IdleSessionWatcher } from "../features/auth/components/IdleSessionWatcher";
import type { LoginRedirectState } from "./routes.types";

export function ProtectedRoute() {
    const { status } = useAuthSession();
    const location = useLocation();

    if (status === "loading") return <SessionLoadingScreen />;

    if (status === "anonymous") {
        const state: LoginRedirectState = { from: { pathname: location.pathname, search: location.search } };
        return <Navigate to="/login" replace state={state} />;
    }

    return (
        <>
            <Outlet />
            <IdleSessionWatcher />
        </>
    );
}
