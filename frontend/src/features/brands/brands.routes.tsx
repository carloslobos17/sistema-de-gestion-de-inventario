// src/features/brands/brands.routes.tsx
// [H0 · BASE] Rutas del módulo de marcas. App.tsx solo las inserta con {brandsRoutes}.
// Ver marcas: cualquier usuario con sesión (por eso no hay RequireRole).
// Crear/editar/desactivar lo controla el backend con can_manage_structure (403 → toast).
import { Route } from "react-router-dom";
import { BrandsListPage } from "./pages/BrandsListPage";

export const brandsRoutes = <Route path="/inventory/brands" element={<BrandsListPage />} />;
