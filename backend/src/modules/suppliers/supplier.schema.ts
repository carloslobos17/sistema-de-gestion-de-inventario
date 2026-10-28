// src/modules/suppliers/supplier.schema.ts
// Reglas según el tipo de proveedor:
//   - Contribuyente: NIT o DUI, NRC y actividad económica obligatorios; correo obligatorio.
//   - Sujeto excluido: DUI, NIT, pasaporte u otro; sin NRC ni actividad; teléfono y correo obligatorios.
import { z } from 'zod';
import { paginationQuerySchema } from '../../utils/pagination';
import {
    districtIdSchema,
    documentTypeSchema,
    economicActivityCodeSchema,
    emailSchema,
    getDocumentNumberError,
    normalizeDocumentNumber,
    nrcSchema,
    optionalPhoneSchema,
    optionalTextSchema,
    phoneSchema,
    requiredTextSchema
} from '../../utils/schemaFields';
import type { SupplierData } from './supplier.types';

export const SUPPLIER_TYPES = ['Taxpayer', 'ExcludedSubject'] as const;

// Campos que tienen los dos tipos
const commonFields = {
    name: requiredTextSchema(2, 200, 'El nombre'),
    document_number: z.string({ message: 'El número de documento es obligatorio' }).trim().min(1, 'El número de documento es obligatorio'),
    district_id: districtIdSchema,
    address: requiredTextSchema(1, 255, 'La dirección'),
    phone_alt: optionalPhoneSchema,
    email: emailSchema
};

const taxpayerSchema = z.object({
    supplier_type: z.literal('Taxpayer'),
    ...commonFields,
    legal_name: optionalTextSchema(200, 'La razón social'),
    document_type: z.enum(['NIT', 'DUI'], { message: 'Un contribuyente se identifica con NIT o DUI' }),
    nrc: nrcSchema,
    economic_activity_code: economicActivityCodeSchema,
    phone: optionalPhoneSchema,
    contact_name: optionalTextSchema(150, 'El nombre del contacto'),
    applies_perception: z.boolean({ message: 'applies_perception debe ser true o false' }).default(false)
});

const excludedSubjectSchema = z.object({
    supplier_type: z.literal('ExcludedSubject'),
    ...commonFields,
    document_type: documentTypeSchema,
    phone: phoneSchema
});

// Datos completos de un proveedor. Se usa al crear y, al editar, sobre los datos actuales + los cambios.
// Lo que no aplica al tipo (ej. NRC de un sujeto excluido) se guarda en null/false.
export const supplierDataSchema = z
    .discriminatedUnion('supplier_type', [taxpayerSchema, excludedSubjectSchema], {
        message: 'El tipo de proveedor debe ser Taxpayer o ExcludedSubject'
    })
    .transform((data) => ({
        ...data,
        document_number: normalizeDocumentNumber(data.document_type, data.document_number)
    }))
    .superRefine((data, ctx) => {
        const error = getDocumentNumberError(data.document_type, data.document_number);
        if (error) ctx.addIssue({ code: 'custom', path: ['document_number'], message: error });
    })
    .transform(
        (data): SupplierData =>
            data.supplier_type === 'Taxpayer'
                ? data
                : {
                      ...data,
                      legal_name: null,
                      nrc: null,
                      economic_activity_code: null,
                      contact_name: null,
                      applies_perception: false
                  }
    );

// PATCH /api/suppliers/:id → solo lo que cambia. Aquí solo se revisa la forma de cada campo;
// las reglas completas se aplican en el service sobre (datos actuales + cambios).
export const updateSupplierSchema = z
    .object({
        supplier_type: z.enum(SUPPLIER_TYPES, { message: 'El tipo de proveedor no es válido' }),
        name: z.string(),
        legal_name: z.string().nullable(),
        document_type: documentTypeSchema,
        document_number: z.string(),
        nrc: z.string().nullable(),
        economic_activity_code: z.string().nullable(),
        district_id: z.number(),
        address: z.string(),
        phone: z.string().nullable(),
        phone_alt: z.string().nullable(),
        email: z.string(),
        contact_name: z.string().nullable(),
        applies_perception: z.boolean(),
        is_active: z.boolean({ message: 'is_active debe ser true o false' })
    })
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: 'Debes enviar al menos un campo para actualizar'
    });

// :id de la URL (llega como texto)
export const supplierIdParamSchema = z.object({
    id: z.coerce.number().int().positive('El ID del proveedor no es válido')
});

// Filtros + paginación del listado: ?search=&is_active=&supplier_type=&page=&limit= (todo llega como texto)
export const supplierFiltersSchema = z.object({
    // search vacío ("") se trata como si no se hubiera enviado
    search: z.string().trim().max(100).optional().transform((value) => value || undefined),
    // OJO: z.coerce.boolean() convertiría "false" en true, por eso se hace así
    is_active: z
        .enum(['true', 'false'], { message: 'is_active debe ser "true" o "false"' })
        .transform((value) => value === 'true')
        .optional(),
    supplier_type: z.enum(SUPPLIER_TYPES, { message: 'supplier_type debe ser Taxpayer o ExcludedSubject' }).optional(),
    ...paginationQuerySchema.shape
});

export type CreateSupplierInput = z.input<typeof supplierDataSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;
