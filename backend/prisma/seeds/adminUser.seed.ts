/// <reference types="node" />
// Crea el primer usuario Administrador para poder entrar en una BD nueva.
// Usuario y contraseña salen del .env (SEED_ADMIN_USERNAME / SEED_ADMIN_PASSWORD): nunca se escriben en el código.
import bcrypt from 'bcrypt';
import type { PrismaClient } from '@prisma/client';
import { ROLE_IDS } from '../../src/constants/roles';

const SALT_ROUNDS = 10; // mismo valor que user.service.ts
const MIN_PASSWORD_LENGTH = 8;

export async function seedAdminUser(prisma: PrismaClient): Promise<void> {
    const username = process.env.SEED_ADMIN_USERNAME?.trim().toLowerCase();
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!username || !password) {
        console.warn('⚠ Usuario administrador: omitido (faltan SEED_ADMIN_USERNAME o SEED_ADMIN_PASSWORD en .env)');
        return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
        throw new Error(`SEED_ADMIN_PASSWORD debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
    }

    const existing = await prisma.user.findUnique({ where: { username }, select: { id: true } });
    if (existing) {
        console.log(`Usuario administrador: "${username}" ya existe (no se modificó)`);
        return;
    }

    await prisma.user.create({
        data: {
            username,
            first_name: 'Administrador',
            last_name: 'del Sistema',
            password_hash: await bcrypt.hash(password, SALT_ROUNDS),
            role_id: ROLE_IDS.ADMIN
        }
    });

    console.log(`Usuario administrador: "${username}" creado`);
}
