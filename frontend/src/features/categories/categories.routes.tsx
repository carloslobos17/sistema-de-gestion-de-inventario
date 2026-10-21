// src/features/categories/categories.routes.tsx
// Rutas del módulo. Ver: cualquier usuario con sesión. Crear/editar/desactivar lo controla
// el backend con can_manage_structure (403 → toast).
import { Route } from "react-router-dom";
import { CategoriesListPage } from "./pages/CategoriesListPage";

export const categoriesRoutes = <Route path="/inventory/categories" element={<CategoriesListPage />} />;
