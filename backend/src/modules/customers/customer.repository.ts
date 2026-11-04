// src/modules/customers/customer.repository.ts
import { prisma } from '../../config/db';
import { getSkip, toPaginationMeta } from '../../utils/pagination';
import type { PaginatedResult, PaginationParams } from '../../types/pagination.types';
import type { Customer, CustomerData, CustomerFilters, UpdateCustomerData } from './customer.types';

// Tipo del "where" de Prisma para clientes, sacado de tu propio cliente
type CustomerWhere = NonNullable<NonNullable<Parameters<typeof prisma.customer.findMany>[0]>['where']>;

// Campos del cliente + su ubicación y actividad (para mostrarlos sin otra consulta)
const CUSTOMER_SELECT = {
    id: true,
    customer_type: true,
    name: true,
    trade_name: true,
    gender: true,
    document_type: true,
    document_number: true,
    nrc: true,
    economic_activity_code: true,
    district_id: true,
    address: true,
    phone: true,
    phone_alt: true,
    email: true,
    credit_limit: true,
    is_active: true,
    created_at: true,
    economic_activity: { select: { name: true } },
    district: {
        select: {
            name: true,
            municipality: {
                select: { id: true, name: true, department: { select: { code: true, name: true } } }
            }
        }
    }
} as const;

type CustomerRow = NonNullable<Awaited<ReturnType<typeof findCustomerRow>>>;

// Solo existe para sacar el tipo de una fila con CUSTOMER_SELECT
function findCustomerRow(id: number) {
    return prisma.customer.findUnique({ where: { id }, select: CUSTOMER_SELECT });
}

// Fila de Prisma (con relaciones anidadas) → objeto plano para el frontend
function toCustomer(row: CustomerRow): Customer {
    const { economic_activity, district, credit_limit, ...customer } = row;
    const municipality = district?.municipality;

    return {
        ...customer,
        credit_limit: Number(credit_limit), // Decimal de Prisma → número (sin esto llegaría como texto "150.00")
        economic_activity_name: economic_activity?.name ?? null,
        department_code: municipality?.department.code ?? null,
        municipality_id: municipality?.id ?? null,
        location_label:
            district && municipality ? `${district.name}, ${municipality.name}, ${municipality.department.name}` : null
    };
}

export class CustomerRepository {
    // Una página del listado + el total. Usa el índice (is_active, name).
    async findPage(filters: CustomerFilters, pagination: PaginationParams): Promise<PaginatedResult<Customer>> {
        const where: CustomerWhere = {};

        if (filters.is_active !== undefined) {
            where.is_active = filters.is_active;
        }

        if (filters.customer_type) {
            where.customer_type = filters.customer_type;
        }

        // Busca por nombre, nombre comercial, correo y teléfono; si el texto trae números, también por documento y NRC
        if (filters.search) {
            const digits = filters.search.replace(/\D/g, '');
            where.OR = [
                { name: { contains: filters.search } },
                { trade_name: { contains: filters.search } },
                { email: { contains: filters.search } },
                { phone: { contains: filters.search } },
                { document_number: { contains: filters.search.replace(/\s+/g, '') } },
                ...(digits ? [{ document_number: { contains: digits } }, { nrc: { contains: digits } }] : [])
            ];
        }

        // Las dos consultas en una transacción para que el total cuadre con los datos
        const [rows, total] = await prisma.$transaction([
            prisma.customer.findMany({
                where,
                select: CUSTOMER_SELECT,
                orderBy: { name: 'asc' },
                skip: getSkip(pagination),
                take: pagination.limit
            }),
            prisma.customer.count({ where })
        ]);

        return { data: rows.map(toCustomer), meta: toPaginationMeta(pagination, total) };
    }

    async findById(id: number): Promise<Customer | null> {
        const row = await findCustomerRow(id);
        return row ? toCustomer(row) : null;
    }

    // Revisa en UNA consulta si otro cliente ya usa el documento o el NRC.
    // El nombre NO se revisa: dos clientes pueden llamarse igual.
    // Devuelve el texto del campo repetido o null si no hay conflicto. Sin documento ni NRC no consulta la BD.
    async findDuplicateField(data: CustomerData, excludeId?: number): Promise<string | null> {
        const conditions = [
            ...(data.document_type && data.document_number
                ? [{ document_type: data.document_type, document_number: data.document_number }]
                : []),
            ...(data.nrc ? [{ nrc: data.nrc }] : [])
        ];
        if (conditions.length === 0) return null;

        const existing = await prisma.customer.findFirst({
            where: {
                OR: conditions,
                ...(excludeId ? { NOT: { id: excludeId } } : {})
            },
            select: { document_type: true, document_number: true }
        });

        if (!existing) return null;

        if (existing.document_type === data.document_type && existing.document_number === data.document_number) {
            return 'ese número de documento';
        }
        return 'ese NRC';
    }

    async create(data: CustomerData): Promise<Customer> {
        const row = await prisma.customer.create({ data, select: CUSTOMER_SELECT });
        return toCustomer(row);
    }

    async update(id: number, data: UpdateCustomerData): Promise<Customer> {
        const row = await prisma.customer.update({ where: { id }, data, select: CUSTOMER_SELECT });
        return toCustomer(row);
    }
}
