// src/utils/getErrorMessage.ts
// Saca un mensaje legible de cualquier error atrapado en un catch.
export function getErrorMessage(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
}
