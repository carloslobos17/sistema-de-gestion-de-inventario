// src/features/payment-methods/model/paymentMethods.constants.ts
// Códigos de CAT-017 que tienen reglas especiales al facturar.

export const PAYMENT_METHOD_CODES = {
    ON_CREDIT: '13', // Cuentas por pagar del receptor → venta al crédito: pide plazo (CAT-018) y período
    OTHER: '99' // Otros → hay que escribir cuál es el medio de pago (methodDetail)
} as const;

// ¿Hay que pedir el detalle del medio de pago? (solo "99 - Otros")
export const requiresMethodDetail = (code: string): boolean => code === PAYMENT_METHOD_CODES.OTHER;

// ¿Hay que pedir plazo y período del crédito? (solo "13 - Cuentas por pagar del receptor")
export const requiresCreditTerm = (code: string): boolean => code === PAYMENT_METHOD_CODES.ON_CREDIT;