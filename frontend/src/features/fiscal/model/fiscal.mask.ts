// src/features/fiscal/model/fiscal.mask.ts
// Máscara de DUI y NIT mientras se escribe: los guiones se ponen solos y solo se aceptan dígitos.
//   DUI → 12345678-9
//   NIT → 0614-123456-123-4 (14 dígitos). Si al terminar quedan 9 dígitos (NIT homologado con el DUI) → 01234567-8
// Funciones puras: no saben nada de React; DocumentFields las usa.
import type { DocumentType } from './fiscal.types';

type MaskedDocumentType = Extract<DocumentType, 'DUI' | 'NIT'>;

// Tamaño de cada grupo de dígitos, separados por guion
const DOCUMENT_MASK_GROUPS: Record<MaskedDocumentType, readonly number[]> = {
    DUI: [8, 1],
    NIT: [4, 6, 3, 1],
};

const NIT_AS_DUI_GROUPS = [8, 1] as const; // NIT homologado: mismo formato que el DUI

export const isMaskedDocumentType = (type: DocumentType | ''): type is MaskedDocumentType => type === 'DUI' || type === 'NIT';

// Máximo de dígitos según el tipo (DUI 9, NIT 14)
export const maxDocumentDigits = (type: MaskedDocumentType) => DOCUMENT_MASK_GROUPS[type].reduce((sum, size) => sum + size, 0);

// Dígitos → texto con guiones. El guion aparece apenas se completa un grupo (si aún faltan grupos),
// así el usuario ve dónde va mientras escribe. Ej. DUI "12345678" → "12345678-".
function applyGroups(digits: string, groups: readonly number[]): string {
    let result = '';
    let index = 0;

    groups.forEach((size, groupIndex) => {
        if (index >= digits.length) return;
        const chunk = digits.slice(index, index + size);
        result += chunk;
        index += chunk.length;
        const isLastGroup = groupIndex === groups.length - 1;
        if (chunk.length === size && !isLastGroup) result += '-';
    });

    return result;
}

// Formato mientras se escribe
export function formatDocumentWhileTyping(type: MaskedDocumentType, digits: string): string {
    return applyGroups(digits.slice(0, maxDocumentDigits(type)), DOCUMENT_MASK_GROUPS[type]);
}

// Formato al salir del campo: quita el guion final suelto y acomoda el NIT de 9 dígitos al formato del DUI
export function formatDocumentOnBlur(type: MaskedDocumentType, value: string): string {
    const digits = value.replace(/\D/g, '');
    if (type === 'NIT' && digits.length === 9) return applyGroups(digits, NIT_AS_DUI_GROUPS);
    return formatDocumentWhileTyping(type, digits).replace(/-$/, '');
}

// Posición del cursor justo después del dígito número `digitCount` (salta el guion si sigue uno)
export function caretAfterDigits(formatted: string, digitCount: number): number {
    if (digitCount <= 0) return 0;
    let seen = 0;
    for (let i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i])) seen++;
        if (seen === digitCount) {
            return formatted[i + 1] === '-' ? i + 2 : i + 1;
        }
    }
    return formatted.length;
}

// Aplica una edición del usuario sobre un campo con máscara.
// Si borró SOLO un guion (los dígitos no cambiaron), se borra el dígito de al lado:
//   Retroceso → el de antes · Supr → el de después.
export function applyMaskedEdit(params: {
    type: MaskedDocumentType;
    previous: string;
    raw: string;
    caret: number;
    inputType?: string;
}): { value: string; caret: number } {
    const { type, previous, raw, caret, inputType } = params;

    let digits = raw.replace(/\D/g, '');
    let digitsBeforeCaret = raw.slice(0, caret).replace(/\D/g, '').length;

    const onlyHyphenDeleted = raw.length < previous.length && digits === previous.replace(/\D/g, '');
    if (onlyHyphenDeleted) {
        if (inputType === 'deleteContentForward') {
            digits = digits.slice(0, digitsBeforeCaret) + digits.slice(digitsBeforeCaret + 1);
        } else if (digitsBeforeCaret > 0) {
            digits = digits.slice(0, digitsBeforeCaret - 1) + digits.slice(digitsBeforeCaret);
            digitsBeforeCaret -= 1;
        }
    }

    const max = maxDocumentDigits(type);
    digits = digits.slice(0, max);
    digitsBeforeCaret = Math.min(digitsBeforeCaret, digits.length);

    const value = formatDocumentWhileTyping(type, digits);
    return { value, caret: caretAfterDigits(value, digitsBeforeCaret) };
}
