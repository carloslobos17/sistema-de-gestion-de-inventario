// src/hooks/useDebouncedValue.ts
// Devuelve el valor solo cuando deja de cambiar durante `delay` ms (ej. para no consultar en cada tecla).
import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(value: T, delay = 300): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}
