import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Iniciando el poblamiento de la base de datos (Seeding)...');

    // 1. Crear Roles Básicos respetando tu modelo exacto
    const rolAdmin = await prisma.rol.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            nombre: 'Administrador',
            modifica_estructura: true // Permisos completos
        },
    });

    const rolVendedor = await prisma.rol.upsert({
        where: { id: 2 },
        update: {},
        create: {
            id: 2,
            nombre: 'Vendedor',
            modifica_estructura: false // Sin permisos para modificar estructura
        },
    });

    console.log('Roles creados o verificados.');

    // 2. Encriptar la contraseña por defecto
    const passwordHash = await bcrypt.hash('admin123', 10);

    // 3. Crear el Usuario Administrador Principal
    const usuarioAdmin = await prisma.usuario.upsert({
        where: { nombre_usuario: 'admin' },
        update: {},
        create: {
            rol_id: rolAdmin.id,
            nombre_usuario: 'admin',
            nombre: 'Carlos',
            apellido: 'Martínez',
            password_hash: passwordHash,
            activo: true
        },
    });

    console.log(`Usuario administrador creado: ${usuarioAdmin.nombre_usuario}`);
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