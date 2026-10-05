// src/features/users/users.routes.tsx
// Rutas del módulo de usuarios. App.tsx solo las inserta con {usersRoutes}.
// Todo el módulo es solo para administradores.
import { Route } from "react-router-dom";
import { RequireRole } from "../../routes/RequireRole";
import { ADMIN_ONLY } from "../auth/auth.roles";
import { UsersListPage } from "./pages/UsersListPage";
import { CreateUserPage } from "./pages/CreateUserPage";
import { EditUserPage } from "./pages/EditUserPage";

export const usersRoutes = (
    <Route element={<RequireRole allowedRoles={ADMIN_ONLY} />}>
        <Route path="/users" element={<UsersListPage />} />
        <Route path="/users/create" element={<CreateUserPage />} />
        <Route path="/users/:id/edit" element={<EditUserPage />} />
    </Route>
);
