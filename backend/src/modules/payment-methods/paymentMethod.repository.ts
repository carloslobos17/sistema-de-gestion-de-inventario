// src/modules/payment-methods/paymentMethod.repository.ts
// Solo lectura: el catálogo lo carga el seed.
import { prisma } from '../../config/db';
import type { PaymentMethod } from './paymentMethod.types';

const PAYMENT_METHOD_SELECT = {
    code: true,
    name: true
} as const;

export class PaymentMethodRepository {
    async findAll(): Promise<PaymentMethod[]> {
        return prisma.paymentMethod.findMany({
            select: PAYMENT_METHOD_SELECT,
            orderBy: { code: 'asc' } // mismo orden que el catálogo oficial
        });
    }
}
