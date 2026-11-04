// src/modules/customers/customer.schema.ts
// Reglas según el tipo de cliente:
//   - Consumidor final: solo el nombre es obligatorio. Documento, ubicación, dirección y correo son opcionales
//     (si da documento, deben venir tipo y número, y el número debe cumplir el formato).
//   - Contribuyente: NIT o DUI, NRC, actividad económica, distrito, dirección y correo obligatorios.
// credit_limit se valida aquí, pero QUIÉN puede enviarlo lo controla la ruta (solo can_manage_structure).
import { z } from 'zod';
import { paginationQuerySchema } from '../../utils/pagination';
import {
    districtIdSchema,
    documentTypeSchema,
    economicActivityCodeSchema,
    emailSchema,
    getDocumentNumberError,
    moneySchema,
    normalizeDocumentNumber,
    nrcSchema,
    optionalEmailSchema,
    optionalPhoneSchema,
    optionalTextSchema,
    requiredTextSchema
} from '../../utils/schemaFields';
import type { CustomerData } from './customer.types';

export const CUSTOMER_TYPES = ['FinalConsumer', 'Taxpayer'] as const;
export const GENDERS = ['M', 'F'] as const;

const creditLimitSchema = moneySchema('El límite de crédito');

// Campos que tienen los dos tipos con las mismas reglas
const commonFields = {
    name: requiredTextSchema(2, 200, 'El nombre'),
    gender: z
        .enum(GENDERS, { message: 'El género debe ser M o F' })
        .nullish()
        .transform((value) => value ?? null),
    phone: optionalPhoneSchema,
    phone_alt: optionalPhoneSchema,
    credit_limit: creditLimitSchema.optional()
};

const finalConsumerSchema = z.object({
    customer_type: z.literal('FinalConsumer'),
    ...commonFields,
    document_type: documentTypeSchema.nullish().transform((value) => value ?? null),
    document_number: optionalTextSchema(30, 'El número de documento'),
    district_id: districtIdSchema.nullish().transform((value) => value ?? null),
    address: optionalTextSchema(255, 'La dirección'),
    email: optionalEmailSchema
});

const taxpayerSchema = z.object({
    customer_type: z.literal('Taxpayer'),
    ...commonFields,
    trade_name: optionalTextSchema(200, 'El nombre comercial'),
    document_type: z.enum(['NIT', 'DUI'], { message: 'Un contribuyente se identifica con NIT o DUI' }),
    document_number: z.string({ message: 'El número de documento es obligatorio' }).trim().min(1, 'El número de documento es obligatorio'),
    nrc: nrcSchema,
    economic_activity_code: economicActivityCodeSchema,
    district_id: districtIdSchema,
    address: requiredTextSchema(1, 255, 'La dirección'),
    email: emailSchema
});

// Datos completos de un cliente. Se usa al crear y, al editar, sobre los datos actuales + los cambios.
// Lo que no aplica al tipo (ej. NRC de un consumidor final) se guarda en null.
export const customerDataSchema = z
    .discriminatedUnion('customer_type', [finalConsumerSchema, taxpayerSchema], {
        message: 'El tipo de cliente debe ser FinalConsumer o Taxpayer'
    })
    .transform((data) => ({
        ...data,
        document_number:
            data.document_type && data.document_number
                ? normalizeDocumentNumber(data.document_type, data.document_number)
                : data.document_number
    }))
    .superRefine((data, ctx) => {
        // Sin documento: válido (solo puede pasar en consumidor final)
        if (!data.document_type && !data.document_number) return;

        if (!data.document_type) {
            ctx.addIssue({ code: 'custom', path: ['document_type'], message: 'Selecciona el tipo de documento' });
            return;
        }
        if (!data.document_number) {
            ctx.addIssue({ code: 'custom', path: ['document_number'], message: 'El número de documento es obligatorio' });
            return;
        }

        const error = getDocumentNumberError(data.document_type, data.document_number);
        if (error) ctx.addIssue({ code: 'custom', path: ['document_number'], message: error });
    })
    .transform(
        (data): CustomerData =>
            data.customer_type === 'Taxpayer'
                ? data
                : { ...data, trade_name: null, nrc: null, economic_activity_code: null }
    );

// PATCH /api/customers/:id → solo lo que cambia. Aquí solo se revisa la forma de cada campo;
// las reglas completas se aplican en el service sobre (datos actuales + cambios).
// credit_limit e is_active se revisan aparte porque solo can_manage_structure los puede cambiar.
export const updateCustomerSchema = z
    .object({
        customer_type: z.enum(CUSTOMER_TYPES, { message: 'El tipo de cliente no es válido' }),
        name: z.string(),
        trade_name: z.string().nullable(),
        gender: z.enum(GENDERS, { message: 'El género debe ser M o F' }).nullable(),
        document_type: documentTypeSchema.nullable(),
        document_number: z.string().nullable(),
        nrc: z.string().nullable(),
        economic_activity_code: z.string().nullable(),
        district_id: z.number().nullable(),
        address: z.string().nullable(),
        phone: z.string().nullable(),
        phone_alt: z.string().nullable(),
        email: z.string().nullable(),
        credit_limit: creditLimitSchema,
        is_active: z.boolean({ message: 'is_active debe ser true o false' })
    })
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: 'Debes enviar al menos un campo para actualizar'
    });

// :id de la URL (llega como texto)
export const customerIdParamSchema = z.object({
    id: z.coerce.number().int().positive('El ID del cliente no es válido')
});

// Filtros + paginación del listado: ?search=&is_active=&customer_type=&page=&limit= (todo llega como texto)
export const customerFiltersSchema = z.object({
    // search vacío ("") se trata como si no se hubiera enviado
    search: z.string().trim().max(100).optional().transform((value) => value || undefined),
    // OJO: z.coerce.boolean() convertiría "false" en true, por eso se hace así
    is_active: z
        .enum(['true', 'false'], { message: 'is_active debe ser "true" o "false"' })
        .transform((value) => value === 'true')
        .optional(),
    customer_type: z.enum(CUSTOMER_TYPES, { message: 'customer_type debe ser FinalConsumer o Taxpayer' }).optional(),
    ...paginationQuerySchema.shape
});

export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
