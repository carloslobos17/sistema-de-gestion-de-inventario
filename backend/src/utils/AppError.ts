// src/utils/AppError.ts
// Error de negocio con su código HTTP. Sirve para cualquier módulo (marcas, categorías, etc.),
// así el controller responde con el status correcto sin comparar mensajes.
export class AppError extends Error {
    constructor(
        message: string,
        public readonly status: number
    ) {
        super(message);
        this.name = 'AppError';
    }
}
