/// <reference types="node" />
// prisma/seed.ts
// Datos iniciales del sistema. Se corre con: npx prisma db seed
// Todo usa upsert: se puede ejecutar varias veces sin duplicar nada.
import { PrismaClient } from '@prisma/client';
import { seedUnitsOfMeasure } from './seeds/unitsOfMeasure.seed';
import { seedLocations } from './seeds/locations.seed';
import { seedEconomicActivities } from './seeds/economicActivities.seed';

const prisma = new PrismaClient();

async function main(): Promise<void> {
    // Roles base (id fijo: el backend usa roleId 1 = Administrador). Si ya existen, no se tocan.
    await prisma.role.upsert({
        where: { id: 1 },
        update: {},
        create: { id: 1, name: 'Administrator', can_manage_structure: true }
    });
    await prisma.role.upsert({
        where: { id: 2 },
        update: {},
        create: { id: 2, name: 'Seller', can_manage_structure: false }
    });
    console.log('✔ Roles: 2 registros');

    // Catálogos fijos de Hacienda
    await seedUnitsOfMeasure(prisma);
    await seedLocations(prisma);
    await seedEconomicActivities(prisma);
}

main()
    .catch((error) => {
        console.error('✖ Error en el seed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
