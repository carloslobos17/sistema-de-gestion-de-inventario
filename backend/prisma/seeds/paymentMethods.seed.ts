// prisma/seeds/paymentMethods.seed.ts
// Catálogo CAT-017 "Forma de pago" del Ministerio de Hacienda (12 ítems). Solo lectura: no tiene CRUD.
import type { PrismaClient } from '@prisma/client';

const PAYMENT_METHODS = [
    { code: '01', name: 'Billetes y monedas' },
    { code: '02', name: 'Tarjeta Débito' },
    { code: '03', name: 'Tarjeta Crédito' },
    { code: '04', name: 'Cheque' },
    { code: '05', name: 'Transferencia-Depósito Bancario' },
    { code: '08', name: 'Dinero electrónico' },
    { code: '09', name: 'Monedero electrónico' },
    { code: '11', name: 'Bitcoin' },
    { code: '12', name: 'Otras Criptomonedas' },
    { code: '13', name: 'Cuentas por pagar del receptor' },
    { code: '14', name: 'Giro bancario' },
    { code: '99', name: 'Otros (se debe indicar el medio de pago)' }
] as const;

export async function seedPaymentMethods(prisma: PrismaClient): Promise<void> {
    await prisma.$transaction(
        PAYMENT_METHODS.map((method) =>
            prisma.paymentMethod.upsert({
                where: { code: method.code },
                update: { name: method.name },
                create: method
            })
        )
    );

    console.log(`✔ Formas de pago (CAT-017): ${PAYMENT_METHODS.length}`);
}
