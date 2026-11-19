// src/modules/customers/customer.repository.ts
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/db';
import { toPaginationMeta } from '../../utils/pagination';
import { findPageIds, sortByIds } from '../../utils/listQuery';
import { escapeLike, formatPhonePrefix, parseSearchTerm } from '../../utils/search';
import type { PaginatedResult, PaginationParams } from '../../types/pagination.types';
import type { Customer, CustomerData, CustomerFilters, UpdateCustomerData } from './customer.types';

// Condiciones SQL del listado. Cada búsqueda usa su propio índice (ver utils/search.ts).
// Por defecto lista solo activos: así el orden por nombre usa el índice (is_active, name).
function buildListConditions(filters: CustomerFilters): Prisma.Sql[] {
    const conditions: Prisma.Sql[] = [Prisma.sql`is_active = ${filters.is_active ?? true}`];

    if (filters.customer_type) {
        conditions.push(Prisma.sql`customer_type = ${filters.customer_type}`);
    }

    if (filters.search) {
        const term = parseSearchTerm(filters.search);

        if (term.kind === 'digits') {
            // DUI, NIT, NRC o teléfono que EMPIEZA con esos dígitos (índices en las 3 columnas)
            const prefix = `${term.digits}%`;
            const phonePrefix = `${formatPhonePrefix(term.digits)}%`;
            conditions.push(Prisma.sql`(document_number LIKE ${prefix} OR nrc LIKE ${prefix}
                OR phone LIKE ${prefix} OR phone LIKE ${phonePrefix})`);
        } else if (term.kind === 'email') {
            conditions.push(Prisma.sql`email LIKE ${`${escapeLike(term.text)}%`}`);
        } else if (term.fullText) {
            // Nombre o nombre comercial, por palabras (índice FULLTEXT)
            conditions.push(Prisma.sql`MATCH(name, trade_name) AGAINST (${term.fullText} IN BOOLEAN MODE)`);
        } else {
            // Texto muy corto (ej. "al"): nombre que empieza con eso (índice is_active, name)
            conditions.push(Prisma.sql`name LIKE ${`${escapeLike(term.prefix)}%`}`);
        }
    }

    return conditions;
}

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
    // Una página del listado + el total. Paso 1: ids y total con índices; paso 2: datos de esos ids.
    async findPage(filters: CustomerFilters, pagination: PaginationParams): Promise<PaginatedResult<Customer>> {
        const { ids, total } = await findPageIds('customers', buildListConditions(filters), pagination);

        const rows =
            ids.length > 0
                ? await prisma.customer.findMany({ where: { id: { in: ids } }, select: CUSTOMER_SELECT })
                : [];

        return { data: sortByIds(rows, ids).map(toCustomer), meta: toPaginationMeta(pagination, total) };
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
