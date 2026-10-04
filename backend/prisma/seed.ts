import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Iniciando el poblamiento de la base de datos (Seeding)...');

    // 1. Crear Roles Básicos
    const adminRole = await prisma.role.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            name: 'Administrator',
            can_manage_structure: true
        },
    });

    const sellerRole = await prisma.role.upsert({
        where: { id: 2 },
        update: {},
        create: {
            id: 2,
            name: 'Seller',
            can_manage_structure: false
        },
    });

    console.log('Roles creados o verificados.');

    // 2. Encriptar la contraseña por defecto
    const passwordHash = await bcrypt.hash('admin123', 10);

    // 3. Crear el Usuario Administrador Principal
    const adminUser = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            role_id: adminRole.id,
            username: 'admin',
            first_name: 'Carlos',
            last_name: 'Martinez',
            password_hash: passwordHash,
            is_active: true
        },
    });

    console.log(`Usuario administrador creado: ${adminUser.username}`);
    console.log('¡Seed completado con éxito!');
}

main()
    .catch((e) => {
        console.error('Error ejecutando el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });