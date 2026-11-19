// prisma/seeds/stress.seed.ts
// Llena la BD con muchos clientes y proveedores falsos para pruebas de rendimiento.
// Uso:   npm run seed:stress                     (100 000 clientes y 20 000 proveedores)
//        npm run seed:stress -- --customers=5000 --suppliers=1000
//        npm run seed:stress -- --clean          (borra todo lo generado: correos @stress.local)
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { STRESS_EMAIL_DOMAIN, buildCustomer, buildSupplier, type StressCatalogs } from './stress/stress.data';

const prisma = new PrismaClient();
const BATCH_SIZE = 1000;
const DEFAULTS = { customers: 100_000, suppliers: 20_000 };

// Lee --clave=valor de la línea de comandos
function readNumberArg(name: string, fallback: number): number {
    const arg = process.argv.find((value) => value.startsWith(`--${name}=`));
    const parsed = arg ? Number(arg.split('=')[1]) : fallback;
    return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

async function loadCatalogs(): Promise<StressCatalogs> {
    const [districts, activities] = await Promise.all([
        prisma.district.findMany({ select: { id: true } }),
        prisma.economicActivity.findMany({ select: { code: true } }),
    ]);
    if (districts.length === 0 || activities.length === 0) {
        throw new Error('Faltan los catálogos de distritos o actividades económicas: corre primero "npx prisma db seed".');
    }
    return { districtIds: districts.map((d) => d.id), activityCodes: activities.map((a) => a.code) };
}

// Inserta por lotes. skipDuplicates salta las pocas filas que choquen con un DUI/NIT/NRC ya existente.
async function insertInBatches(
    label: string,
    total: number,
    insertBatch: (from: number, size: number) => Promise<number>
): Promise<void> {
    if (total === 0) return;
    const startedAt = Date.now();
    let inserted = 0;

    for (let from = 0; from < total; from += BATCH_SIZE) {
        const size = Math.min(BATCH_SIZE, total - from);
        inserted += await insertBatch(from, size);

        const seconds = (Date.now() - startedAt) / 1000;
        const perSecond = Math.round(inserted / Math.max(seconds, 0.001));
        process.stdout.write(`\r  ${label}: ${inserted.toLocaleString('es-SV')} / ${total.toLocaleString('es-SV')}  (${perSecond.toLocaleString('es-SV')} por segundo)   `);
    }

    const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
    console.log(`\n  ✔ ${label}: ${inserted.toLocaleString('es-SV')} insertados en ${seconds} s (${total - inserted} saltados por duplicado)`);
}

async function seed(): Promise<void> {
    const customers = readNumberArg('customers', DEFAULTS.customers);
    const suppliers = readNumberArg('suppliers', DEFAULTS.suppliers);
    const catalogs = await loadCatalogs();

    // El número de secuencia continúa desde lo ya generado: se puede correr varias veces
    const [existingCustomers, existingSuppliers] = await Promise.all([
        prisma.customer.count({ where: { email: { endsWith: `@${STRESS_EMAIL_DOMAIN}` } } }),
        prisma.supplier.count({ where: { email: { endsWith: `@${STRESS_EMAIL_DOMAIN}` } } }),
    ]);

    console.log(`Generando ${customers.toLocaleString('es-SV')} clientes y ${suppliers.toLocaleString('es-SV')} proveedores (lotes de ${BATCH_SIZE})...`);

    await insertInBatches('Clientes', customers, async (from, size) => {
        const data = Array.from({ length: size }, (_, i) => buildCustomer(existingCustomers + from + i + 1, catalogs));
        const { count } = await prisma.customer.createMany({ data, skipDuplicates: true });
        return count;
    });

    await insertInBatches('Proveedores', suppliers, async (from, size) => {
        const data = Array.from({ length: size }, (_, i) => buildSupplier(existingSuppliers + from + i + 1, catalogs));
        const { count } = await prisma.supplier.createMany({ data, skipDuplicates: true });
        return count;
    });
}

async function clean(): Promise<void> {
    const where = { email: { endsWith: `@${STRESS_EMAIL_DOMAIN}` } };
    const [customers, suppliers] = await prisma.$transaction([
        prisma.customer.deleteMany({ where }),
        prisma.supplier.deleteMany({ where }),
    ]);
    console.log(`✔ Borrados ${customers.count.toLocaleString('es-SV')} clientes y ${suppliers.count.toLocaleString('es-SV')} proveedores de prueba.`);
}

async function main(): Promise<void> {
    // Nunca en producción: llenaría la BD real con datos falsos
    if (process.env.NODE_ENV === 'production') {
        throw new Error('El seed de estrés no se puede correr con NODE_ENV=production.');
    }
    if (process.argv.includes('--clean')) await clean();
    else await seed();
}

main()
    .catch((error) => {
        console.error('\n✖ Error en el seed de estrés:', error instanceof Error ? error.message : error);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
