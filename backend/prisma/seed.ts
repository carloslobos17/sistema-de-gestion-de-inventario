/// <reference types="node" />
// prisma/seed.ts
// Datos iniciales del sistema. Se corre con: npx prisma db seed
// Todo usa upsert o revisa si ya existe: se puede ejecutar varias veces sin duplicar nada.
import { PrismaClient } from '@prisma/client';
import { ROLE_IDS } from '../src/constants/roles';
import { seedUnitsOfMeasure } from './seeds/unitsOfMeasure.seed';
import { seedLocations } from './seeds/locations.seed';
import { seedEconomicActivities } from './seeds/economicActivities.seed';
import { seedPaymentMethods } from './seeds/paymentMethods.seed';
import { seedAdminUser } from './seeds/adminUser.seed';

const prisma = new PrismaClient();

async function main(): Promise<void> {
    // Roles base (id fijo: el backend los usa desde src/constants/roles.ts). Si ya existen, no se tocan.
    await prisma.role.upsert({
        where: { id: ROLE_IDS.ADMIN },
        update: {},
        create: { id: ROLE_IDS.ADMIN, name: 'Administrator', can_manage_structure: true }
    });
    await prisma.role.upsert({
        where: { id: ROLE_IDS.SELLER },
        update: {},
        create: { id: ROLE_IDS.SELLER, name: 'Seller', can_manage_structure: false }
    });
    console.log('✔ Roles: 2 registros');

    // Catálogos fijos de Hacienda
    await seedUnitsOfMeasure(prisma);
    await seedLocations(prisma);
    await seedEconomicActivities(prisma);
    await seedPaymentMethods(prisma);

    // Primer usuario (va al final: necesita que exista el rol Administrador)
    await seedAdminUser(prisma);
}

main()
    .catch((error) => {
        console.error('Error en el seed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
