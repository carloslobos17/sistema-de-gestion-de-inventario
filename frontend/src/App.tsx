// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { UsuariosPage } from "./pages/UsuariosPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                {/* Todo lo que va aquí exige sesión y muestra el Navbar */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                        <Route path="/usuarios" element={<UsuariosPage />} />
                        {/* futuras: /categorias, /proveedores, /clientes */}
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/usuarios" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;