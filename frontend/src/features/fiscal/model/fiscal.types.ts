// src/features/fiscal/model/fiscal.types.ts
// Datos fiscales compartidos por proveedores, clientes y (más adelante) ventas y compras.

// Tipo de documento de identificación (mismos valores que la factura electrónica y el backend)
export type DocumentType = 'NIT' | 'DUI' | 'PASSPORT' | 'RESIDENT_CARD' | 'OTHER';

export interface DocumentTypeOption {
    value: DocumentType;
    label: string;
}

// Props de <DocumentFields>: tipo de documento + número
export interface DocumentFieldsProps {
    idPrefix: string;
    documentType: DocumentType | '';
    documentNumber: string;
    allowedTypes: readonly DocumentType[]; // ej. contribuyente: solo NIT y DUI
    onDocumentTypeChange: (type: DocumentType | '') => void;
    onDocumentNumberChange: (value: string) => void;
    typeError?: string;
    numberError?: string;
    disabled?: boolean;
}
