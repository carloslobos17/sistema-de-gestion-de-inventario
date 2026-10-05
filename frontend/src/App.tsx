// src/App.tsx
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { usersRoutes } from "./features/users/users.routes";

function App() {
    return (
        <BrowserRouter>
            {/* Notificaciones globales: fuera de las rutas para que sobrevivan al cambiar de página */}
            <Toaster position="top-right" richColors closeButton />

            <Routes>
                {/* 1. Rutas públicas */}
                <Route path="/login" element={<LoginPage />} />

                {/* 2. Rutas protegidas: exigen sesión */}
                <Route element={<ProtectedRoute />}>
                    {/* Marco con header y menú, siempre visible */}
                    <Route element={<AppLayout />}>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<DashboardPage />} />

                        {/* Módulos: una línea por cada uno */}
                        {usersRoutes}
                        {/* {inventoryRoutes} */}
                        {/* {purchasesRoutes} */}

                        {/* 3. Cualquier otra URL */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;