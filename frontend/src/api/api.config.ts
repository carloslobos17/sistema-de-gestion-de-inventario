// src/api/api.config.ts
// Dirección del backend y tiempo de espera, compartidos por los clientes HTTP.
// Por defecto "/api": el proxy de Vite (desarrollo) o nginx (producción) lo envía al backend.
// Solo si el backend vive en otro dominio se define VITE_API_URL en el .env del frontend.
export const API_URL: string = import.meta.env.VITE_API_URL || '/api';

export const REQUEST_TIMEOUT_MS = 10_000;
