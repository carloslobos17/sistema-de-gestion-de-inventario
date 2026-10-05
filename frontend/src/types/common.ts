// src/types/common.ts
// Tipos compartidos por todos los módulos (usuarios, marcas, categorías...).
// Los tipos de las respuestas HTTP (ApiResponse, ApiErrorBody) viven en src/api/api.types.ts.

// Resultado de una acción (crear, editar, desactivar...).
// La página decide qué hacer: si ok → toast/cerrar/redirigir; si no → mostrar el error.
// Para leer result.error usar: if (result.ok === false) { ... }
export type ActionResult<T = void> = { ok: true; data: T } | { ok: false; error: string };
