// src/modules/payment-methods/payment-method.types.ts
// CAT-017 Forma de pago (Hacienda). El code es el que se envía como paymentCode al emitir la factura.

export interface PaymentMethod {
    code: string; // "01", "02"... "99" (con el cero a la izquierda)
    name: string;
}
