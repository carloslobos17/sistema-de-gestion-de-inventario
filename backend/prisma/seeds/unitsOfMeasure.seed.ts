// prisma/seeds/unitsOfMeasure.seed.ts
// Catálogo CAT-014 "Unidad de Medida" del Ministerio de Hacienda (DTE). El id ES el código oficial.
// Usa upsert: se puede correr las veces que sea sin duplicar; si Hacienda cambia un nombre, se actualiza.
import type { PrismaClient } from '@prisma/client';

const UNITS_OF_MEASURE = [
    { id: 1, name: 'Metro' },
    { id: 2, name: 'Yarda' },
    { id: 6, name: 'Milímetro' },
    { id: 9, name: 'Kilómetro cuadrado' },
    { id: 10, name: 'Hectárea' },
    { id: 13, name: 'Metro cuadrado' },
    { id: 15, name: 'Vara cuadrada' },
    { id: 18, name: 'Metro cúbico' },
    { id: 20, name: 'Barril' },
    { id: 22, name: 'Galón' },
    { id: 23, name: 'Litro' },
    { id: 24, name: 'Botella' },
    { id: 26, name: 'Mililitro' },
    { id: 30, name: 'Tonelada' },
    { id: 32, name: 'Quintal' },
    { id: 33, name: 'Arroba' },
    { id: 34, name: 'Kilogramo' },
    { id: 36, name: 'Libra' },
    { id: 37, name: 'Onza troy' },
    { id: 38, name: 'Onza' },
    { id: 39, name: 'Gramo' },
    { id: 40, name: 'Miligramo' },
    { id: 42, name: 'Megawatt' },
    { id: 43, name: 'Kilowatt' },
    { id: 44, name: 'Watt' },
    { id: 45, name: 'Megavoltio-amperio' },
    { id: 46, name: 'Kilovoltio-amperio' },
    { id: 47, name: 'Voltio-amperio' },
    { id: 49, name: 'Gigawatt-hora' },
    { id: 50, name: 'Megawatt-hora' },
    { id: 51, name: 'Kilowatt-hora' },
    { id: 52, name: 'Watt-hora' },
    { id: 53, name: 'Kilovoltio' },
    { id: 54, name: 'Voltio' },
    { id: 55, name: 'Millar' },
    { id: 56, name: 'Medio millar' },
    { id: 57, name: 'Ciento' },
    { id: 58, name: 'Docena' },
    { id: 59, name: 'Unidad' },
    { id: 99, name: 'Otra' },
];

export async function seedUnitsOfMeasure(prisma: PrismaClient): Promise<void> {
    await prisma.$transaction(
        UNITS_OF_MEASURE.map((unit) =>
            prisma.unitOfMeasure.upsert({
                where: { id: unit.id },
                update: { name: unit.name },
                create: unit
            })
        )
    );

    console.log(`✔ Unidades de medida: ${UNITS_OF_MEASURE.length} registros`);
}