// src/modules/payment-methods/payment-method.service.ts
import { PaymentMethodRepository } from './payment-method.repository';
import type { PaymentMethod } from './payment-method.types';

export class PaymentMethodService {
    private paymentMethodRepository = new PaymentMethodRepository();

    async list(): Promise<PaymentMethod[]> {
        return this.paymentMethodRepository.findAll();
    }
}
