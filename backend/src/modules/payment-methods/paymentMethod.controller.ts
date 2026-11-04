// src/modules/payment-methods/paymentMethod.controller.ts
import { Request, Response } from 'express';
import { PaymentMethodService } from './paymentMethod.service';

const paymentMethodService = new PaymentMethodService();

export class PaymentMethodController {
    // GET /api/payment-methods
    async list(_req: Request, res: Response): Promise<void> {
        try {
            const paymentMethods = await paymentMethodService.list();
            res.status(200).json({ data: paymentMethods });
        } catch (error) {
            console.error('[PaymentMethodController - list] Error interno:', error);
            res.status(500).json({ error: 'Error interno del servidor. Contacte al administrador.' });
        }
    }
}
