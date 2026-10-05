// src/features/auth/auth.roles.ts
// IDs de los roles (los mismos de la tabla roles del backend: ADMIN_ROLE_ID = 1).
export const ROLE_IDS = {
    ADMIN: 1,
    SELLER: 2,
} as const;

// Grupos de roles reutilizables para rutas y menú
export const ADMIN_ONLY: readonly number[] = [ROLE_IDS.ADMIN];

// ¿El rol del usuario está entre los permitidos?
// Si no se indican roles (undefined), cualquier usuario con sesión tiene acceso.
export function hasAnyRole(roleId: number | undefined, allowedRoles?: readonly number[]): boolean {
    if (!allowedRoles) return true;
    return roleId !== undefined && allowedRoles.includes(roleId);
}
