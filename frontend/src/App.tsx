// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { UsersPage } from "./pages/UsersPage";
import { CreateUserPage } from "./pages/CreateUserPage";
import { EditUserPage } from "./pages/EditUserPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                {/* Todo lo que va aquí exige sesión; cada página se envuelve en <AppLayout> */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/users/create" element={<CreateUserPage />} />
                    <Route path="/users/:id/edit" element={<EditUserPage />} />
                    {/* futuras: /categories, /suppliers, /customers */}
                </Route>

                <Route path="*" element={<Navigate to="/users" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;