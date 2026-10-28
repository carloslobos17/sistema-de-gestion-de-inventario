// src/utils/schemaFields.ts
// Campos y reglas de Zod reutilizables (proveedores, clientes...). Así todos los módulos validan igual.
import { z } from 'zod';

export const onlyDigits = (value: string) => value.replace(/\D/g, '');

// ==========================================
// DOCUMENTO DE IDENTIFICACIÓN (mismos tipos que la factura electrónica)
// ==========================================

export const DOCUMENT_TYPES = ['NIT', 'DUI', 'PASSPORT', 'RESIDENT_CARD', 'OTHER'] as const;
export type DocumentTypeValue = (typeof DOCUMENT_TYPES)[number];

// NIT y DUI se guardan solo con dígitos; pasaporte, carné y otros, sin espacios y en mayúsculas
export function normalizeDocumentNumber(type: DocumentTypeValue, value: string): string {
    return type === 'NIT' || type === 'DUI' ? onlyDigits(value) : value.replace(/\s+/g, '').toUpperCase();
}

// Mensaje de error si el número no cumple el formato de su tipo (o null si está bien). Recibe el número ya normalizado.
export function getDocumentNumberError(type: DocumentTypeValue, value: string): string | null {
    switch (type) {
        case 'NIT':
            return value.length === 14 || value.length === 9 ? null : 'El NIT debe tener 14 dígitos (o 9 si es un DUI)';
        case 'DUI':
            return value.length === 9 ? null : 'El DUI debe tener 9 dígitos';
        default:
            return /^[A-Z0-9-]{3,20}$/.test(value) ? null : 'El documento debe tener entre 3 y 20 letras o números';
    }
}

export const documentTypeSchema = z.enum(DOCUMENT_TYPES, { message: 'El tipo de documento no es válido' });

// ==========================================
// DATOS FISCALES
// ==========================================

// NRC: de 1 a 8 dígitos (se aceptan guiones al escribirlo)
export const nrcSchema = z
    .string({ message: 'El NRC es obligatorio' })
    .transform(onlyDigits)
    .refine((value) => /^\d{1,8}$/.test(value), { message: 'El NRC debe tener entre 1 y 8 dígitos' });

// Código de actividad económica (catálogo CAT-019): 5 dígitos
export const economicActivityCodeSchema = z
    .string({ message: 'La actividad económica es obligatoria' })
    .regex(/^\d{5}$/, 'La actividad económica no es válida');

// Distrito (de él salen el municipio y el departamento)
export const districtIdSchema = z
    .number({ message: 'El distrito es obligatorio' })
    .int('El distrito no es válido')
    .positive('El distrito es obligatorio');

// ==========================================
// TEXTO, TELÉFONO Y CORREO
// ==========================================

// Texto obligatorio, sin espacios de más
export const requiredTextSchema = (min: number, max: number, label: string) =>
    z
        .string({ message: `${label} es obligatorio` })
        .trim()
        .min(min, min === 1 ? `${label} es obligatorio` : `${label} debe tener al menos ${min} caracteres`)
        .max(max, `${label} no puede superar los ${max} caracteres`)
        .transform((value) => value.replace(/\s+/g, ' '));

// Texto opcional: se limpia y "" se guarda como null
export const optionalTextSchema = (max: number, label: string) =>
    z
        .string()
        .trim()
        .max(max, `${label} no puede superar los ${max} caracteres`)
        .nullish()
        .transform((value) => value || null);

const PHONE_REGEX = /^[\d\s()+-]+$/;
const PHONE_MESSAGE = 'El teléfono solo puede contener números, espacios, +, - y paréntesis';

// Teléfono obligatorio (ej. "7777-7777", "+503 2222 3333")
export const phoneSchema = z
    .string({ message: 'El teléfono es obligatorio' })
    .trim()
    .min(1, 'El teléfono es obligatorio')
    .max(50, 'El teléfono no puede superar los 50 caracteres')
    .regex(PHONE_REGEX, PHONE_MESSAGE);

// Teléfono opcional: "" → null
export const optionalPhoneSchema = z
    .string()
    .trim()
    .max(50, 'El teléfono no puede superar los 50 caracteres')
    .refine((value) => value === '' || PHONE_REGEX.test(value), { message: PHONE_MESSAGE })
    .nullish()
    .transform((value) => value || null);

// Correo obligatorio, guardado en minúsculas
export const emailSchema = z
    .string({ message: 'El correo es obligatorio' })
    .trim()
    .toLowerCase()
    .min(1, 'El correo es obligatorio')
    .max(150, 'El correo no puede superar los 150 caracteres')
    .pipe(z.email('El correo no es válido'));

// Correo opcional: "" → null
export const optionalEmailSchema = z
    .string()
    .trim()
    .toLowerCase()
    .max(150, 'El correo no puede superar los 150 caracteres')
    .nullish()
    .transform((value) => value || null)
    .refine((value) => value === null || z.email().safeParse(value).success, {
        message: 'El correo no es válido'
    });
