// prisma/seed.ts
/// <reference types="node" />
// Datos iniciales del sistema. Se corre con: npx prisma db seed
// Todo usa upsert: se puede ejecutar varias veces sin duplicar nada.
import { PrismaClient } from '@prisma/client';
import { seedUnitsOfMeasure } from './seeds/unitsOfMeasure.seed';
import { seedLocations } from './seeds/locations.seed';

const prisma = new PrismaClient();


async function main(): Promise<void> {
    // Roles base (id fijo: el backend usa roleId 1 = Administrador)
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

    // Catálogos de Hacienda
    await seedUnitsOfMeasure(prisma);
    await seedLocations(prisma);
}

main()
    .catch((error) => {
        console.error('✖ Error en el seed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });