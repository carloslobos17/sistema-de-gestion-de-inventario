// src/constants/roles.ts
// IDs fijos de la tabla roles (los crea prisma/seed.ts). Única fuente en el backend: nadie escribe "1" a mano.
export const ROLE_IDS = {
    ADMIN: 1,
    SELLER: 2
} as const;
