// src/features/suppliers/suppliers.routes.tsx
// Rutas del módulo. Ver la lista: cualquier usuario con sesión.
// Crear/editar: solo roles con can_manage_structure (sin permiso, vuelve a la lista).
import { Route } from "react-router-dom";
import { RequireStructurePermission } from "../../routes/RequireStructurePermission";
import { SuppliersListPage } from "./pages/SuppliersListPage";
import { CreateSupplierPage } from "./pages/CreateSupplierPage";
import { EditSupplierPage } from "./pages/EditSupplierPage";

export const suppliersRoutes = (
    <>
        <Route path="/suppliers" element={<SuppliersListPage />} />
        <Route element={<RequireStructurePermission redirectTo="/suppliers" />}>
            <Route path="/suppliers/create" element={<CreateSupplierPage />} />
            <Route path="/suppliers/:id/edit" element={<EditSupplierPage />} />
        </Route>
    </>
);
