// src/routes/routes.types.ts
export interface RequireRoleProps {
    allowedRoles: readonly number[];
    redirectTo?: string; // a dónde mandar si no tiene permiso (por defecto /dashboard)
}


export interface RequireStructurePermissionProps {
    redirectTo?: string; // a dónde mandar si no tiene can_manage_structure (por defecto /dashboard)
}