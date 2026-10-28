// src/features/fiscal/model/fiscal.constants.ts
import type { DocumentType, DocumentTypeOption } from './fiscal.types';

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
    NIT: 'NIT',
    DUI: 'DUI',
    PASSPORT: 'Pasaporte',
    RESIDENT_CARD: 'Carné de residente',
    OTHER: 'Otro',
};

export const DOCUMENT_TYPE_OPTIONS: DocumentTypeOption[] = (Object.keys(DOCUMENT_TYPE_LABELS) as DocumentType[]).map(
    (value) => ({ value, label: DOCUMENT_TYPE_LABELS[value] })
);

// Ejemplo que se muestra en el campo del número según el tipo
export const DOCUMENT_NUMBER_PLACEHOLDERS: Record<DocumentType, string> = {
    NIT: '0614-123456-123-4',
    DUI: '01234567-8',
    PASSPORT: 'A1234567',
    RESIDENT_CARD: 'Número del carné',
    OTHER: 'Número del documento',
};
