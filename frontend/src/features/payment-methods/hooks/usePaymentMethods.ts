// src/features/payment-methods/hooks/usePaymentMethods.ts
// Trae el catálogo UNA sola vez por sesión: la promesa se guarda a nivel de módulo
// y todos los selects de la app (ventas, compras, abonos...) la comparten.
import { useEffect, useState } from 'react';
import { fetchPaymentMethods } from '../api/paymentMethods.service';
import type { PaymentMethod } from '../model/paymentMethods.types';

let cachedRequest: Promise<PaymentMethod[]> | null = null;

function loadPaymentMethods(): Promise<PaymentMethod[]> {
    if (!cachedRequest) {
        cachedRequest = fetchPaymentMethods().catch((error) => {
            cachedRequest = null; // si falló, el próximo select vuelve a intentarlo
            throw error;
        });
    }
    return cachedRequest;
}

export function usePaymentMethods() {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        loadPaymentMethods()
            .then((data) => {
                if (isMounted) setPaymentMethods(data);
            })
            .catch((err: Error) => {
                if (isMounted) setError(err.message);
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return { paymentMethods, isLoading, error };
}
