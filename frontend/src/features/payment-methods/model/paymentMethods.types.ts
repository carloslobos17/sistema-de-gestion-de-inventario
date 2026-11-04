// src/features/payment-methods/model/paymentMethods.types.ts
// CAT-017 Forma de pago (Hacienda). Catálogo de solo lectura.

export interface PaymentMethod {
    code: string; // "01"... "99"
    name: string;
}

export interface PaymentMethodSelectProps {
    id: string;
    value: string; // "" = sin elegir
    onChange: (code: string) => void;
    exclude?: string[]; // códigos que no se deben ofrecer en esa pantalla (ej. ["13"] si el crédito se maneja aparte)
    placeholder?: string;
    hasError?: boolean;
    disabled?: boolean;
    describedBy?: string;
}
