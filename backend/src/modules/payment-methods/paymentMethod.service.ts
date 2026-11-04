// src/modules/payment-methods/paymentMethod.service.ts
import { PaymentMethodRepository } from './paymentMethod.repository';
import type { PaymentMethod } from './paymentMethod.types';

export class PaymentMethodService {
    private paymentMethodRepository = new PaymentMethodRepository();

    async list(): Promise<PaymentMethod[]> {
        return this.paymentMethodRepository.findAll();
    }
}
