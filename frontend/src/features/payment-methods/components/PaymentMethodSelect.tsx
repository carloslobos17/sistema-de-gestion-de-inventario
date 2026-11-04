// src/features/payment-methods/components/PaymentMethodSelect.tsx
// Select reutilizable de formas de pago (CAT-017). Usa el Select compartido para verse igual que el resto de campos.
import { useMemo } from 'react';
import { Select } from '../../../components/ui/Select';
import { usePaymentMethods } from '../hooks/usePaymentMethods';
import type { PaymentMethodSelectProps } from '../model/paymentMethods.types';

const NO_EXCLUSIONS: string[] = []; // constante para no crear un arreglo nuevo en cada render

export function PaymentMethodSelect({
    id,
    value,
    onChange,
    exclude = NO_EXCLUSIONS,
    placeholder = 'Seleccione...',
    hasError = false,
    disabled = false,
    describedBy
}: PaymentMethodSelectProps) {
    const { paymentMethods, isLoading, error } = usePaymentMethods();

    const options = useMemo(
        () => paymentMethods.filter((method) => !exclude.includes(method.code)),
        [paymentMethods, exclude]
    );

    const firstOptionLabel = isLoading ? 'Cargando...' : (error ?? placeholder);

    return (
        <Select
            id={id}
            name={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || isLoading}
            hasError={hasError || Boolean(error)}
            aria-describedby={describedBy}
        >
            <option value="">{firstOptionLabel}</option>
            {options.map((method) => (
                <option key={method.code} value={method.code}>
                    {method.code} · {method.name}
                </option>
            ))}
        </Select>
    );
}
