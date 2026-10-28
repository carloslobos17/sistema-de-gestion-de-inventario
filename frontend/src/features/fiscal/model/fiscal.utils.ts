// src/features/fiscal/model/fiscal.utils.ts
// Funciones puras para documentos y NRC. Mismas reglas que el backend (src/utils/schemaFields.ts).
import type { DocumentType } from './fiscal.types';

export const onlyDigits = (value: string) => value.replace(/\D/g, '');

// NIT y DUI se envían solo con dígitos; pasaporte, carné y otros, sin espacios y en mayúsculas
export function normalizeDocumentNumber(type: DocumentType, value: string): string {
    return type === 'NIT' || type === 'DUI' ? onlyDigits(value) : value.replace(/\s+/g, '').toUpperCase();
}

// Mensaje de error si el número no cumple el formato de su tipo (o null si está bien)
export function getDocumentNumberError(type: DocumentType, value: string): string | null {
    const normalized = normalizeDocumentNumber(type, value);
    if (!normalized) return 'El número de documento es obligatorio';

    switch (type) {
        case 'NIT':
            return normalized.length === 14 || normalized.length === 9 ? null : 'El NIT debe tener 14 dígitos (o 9 si es un DUI)';
        case 'DUI':
            return normalized.length === 9 ? null : 'El DUI debe tener 9 dígitos';
        default:
            return /^[A-Z0-9-]{3,20}$/.test(normalized) ? null : 'Debe tener entre 3 y 20 letras o números';
    }
}

// Para mostrar: "06141234561234" → "0614-123456-123-4" · DUI "012345678" → "01234567-8"
export function formatDocumentNumber(type: DocumentType, value: string): string {
    if (type === 'NIT' && value.length === 14) {
        return `${value.slice(0, 4)}-${value.slice(4, 10)}-${value.slice(10, 13)}-${value.slice(13)}`;
    }
    if ((type === 'NIT' || type === 'DUI') && value.length === 9) {
        return `${value.slice(0, 8)}-${value.slice(8)}`;
    }
    return value;
}

// "1234567" → "123456-7"
export function formatNrc(nrc: string | null): string {
    if (!nrc) return '';
    return nrc.length > 1 ? `${nrc.slice(0, -1)}-${nrc.slice(-1)}` : nrc;
}

export const isValidNrc = (value: string) => /^\d{1,8}$/.test(onlyDigits(value));
