// src/features/customers/customers.routes.tsx
// Rutas del módulo. A diferencia de proveedores, crear y editar son para CUALQUIER usuario con sesión
// (el vendedor registra clientes en caja). El permiso solo afecta: límite de crédito y desactivar/reactivar.
import { Route } from "react-router-dom";
import { CustomersListPage } from "./pages/CustomersListPage";
import { CreateCustomerPage } from "./pages/CreateCustomerPage";
import { EditCustomerPage } from "./pages/EditCustomerPage";

export const customersRoutes = (
    <>
        <Route path="/customers" element={<CustomersListPage />} />
        <Route path="/customers/create" element={<CreateCustomerPage />} />
        <Route path="/customers/:id/edit" element={<EditCustomerPage />} />
    </>
);
