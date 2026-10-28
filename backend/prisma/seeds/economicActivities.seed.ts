// prisma/seeds/economicActivities.seed.ts
// Carga el catálogo de actividades económicas de Hacienda. Usa upsert: se puede correr varias veces sin duplicar.
import type { PrismaClient } from '@prisma/client';
import { ECONOMIC_ACTIVITIES } from './data/economicActivities.data';

export async function seedEconomicActivities(prisma: PrismaClient): Promise<void> {
    await prisma.$transaction(
        ECONOMIC_ACTIVITIES.map((activity) =>
            prisma.economicActivity.upsert({
                where: { code: activity.code },
                update: { name: activity.name },
                create: activity
            })
        )
    );

    console.log(`✔ Actividades económicas: ${ECONOMIC_ACTIVITIES.length} registros`);
}
