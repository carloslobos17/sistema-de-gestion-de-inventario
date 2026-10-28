// src/features/units/model/units.types.ts
// Catálogo de unidades de medida de Hacienda (CAT-014). Solo lectura: no tiene pantalla propia.

// Tal como la devuelve GET /api/units. El id es el código oficial de Hacienda.
export interface UnitOfMeasure {
    id: number;
    name: string;
}
