// src/modules/suppliers/supplier.repository.ts
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/db';
import { toPaginationMeta } from '../../utils/pagination';
import { findPageIds, sortByIds } from '../../utils/listQuery';
import { escapeLike, parseSearchTerm } from '../../utils/search';
import type { PaginatedResult, PaginationParams } from '../../types/pagination.types';
import type { Supplier, SupplierData, SupplierFilters, SupplierOption, UpdateSupplierData } from './supplier.types';

// Condiciones SQL del listado. Cada búsqueda usa su propio índice (ver utils/search.ts).
// Por defecto lista solo activos: así el orden por nombre usa el índice (is_active, name).
function buildListConditions(filters: SupplierFilters): Prisma.Sql[] {
    const conditions: Prisma.Sql[] = [Prisma.sql`is_active = ${filters.is_active ?? true}`];

    if (filters.supplier_type) {
        conditions.push(Prisma.sql`supplier_type = ${filters.supplier_type}`);
    }

    if (filters.search) {
        const term = parseSearchTerm(filters.search);

        if (term.kind === 'digits') {
            // NIT, DUI o NRC que EMPIEZA con esos dígitos
            const prefix = `${term.digits}%`;
            conditions.push(Prisma.sql`(document_number LIKE ${prefix} OR nrc LIKE ${prefix})`);
        } else if (term.kind === 'email') {
            conditions.push(Prisma.sql`email LIKE ${`${escapeLike(term.text)}%`}`);
        } else if (term.fullText) {
            // Nombre, razón social o contacto, por palabras (índice FULLTEXT)
            conditions.push(Prisma.sql`MATCH(name, legal_name, contact_name) AGAINST (${term.fullText} IN BOOLEAN MODE)`);
        } else {
            // Texto muy corto: nombre que empieza con eso
            conditions.push(Prisma.sql`name LIKE ${`${escapeLike(term.prefix)}%`}`);
        }
    }

    return conditions;
}

// Campos del proveedor + su ubicación y actividad (para mostrarlos sin otra consulta)
const SUPPLIER_SELECT = {
    id: true,
    supplier_type: true,
    name: true,
    legal_name: true,
    document_type: true,
    document_number: true,
    nrc: true,
    economic_activity_code: true,
    district_id: true,
    address: true,
    phone: true,
    phone_alt: true,
    email: true,
    contact_name: true,
    applies_perception: true,
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

type SupplierRow = NonNullable<Awaited<ReturnType<typeof findSupplierRow>>>;

// Solo existe para sacar el tipo de una fila con SUPPLIER_SELECT
function findSupplierRow(id: number) {
    return prisma.supplier.findUnique({ where: { id }, select: SUPPLIER_SELECT });
}

// Fila de Prisma (con relaciones anidadas) → objeto plano para el frontend
function toSupplier(row: SupplierRow): Supplier {
    const { economic_activity, district, ...supplier } = row;
    const { municipality } = district;

    return {
        ...supplier,
        economic_activity_name: economic_activity?.name ?? null,
        department_code: municipality.department.code,
        municipality_id: municipality.id,
        location_label: `${district.name}, ${municipality.name}, ${municipality.department.name}`
    };
}

export class SupplierRepository {
    // Una página del listado + el total. Paso 1: ids y total con índices; paso 2: datos de esos ids.
    async findPage(filters: SupplierFilters, pagination: PaginationParams): Promise<PaginatedResult<Supplier>> {
        const { ids, total } = await findPageIds('suppliers', buildListConditions(filters), pagination);

        const rows =
            ids.length > 0
                ? await prisma.supplier.findMany({ where: { id: { in: ids } }, select: SUPPLIER_SELECT })
                : [];

        return { data: sortByIds(rows, ids).map(toSupplier), meta: toPaginationMeta(pagination, total) };
    }

    // Para los selects (ej. registrar una compra): solo activos, solo id y nombre
    async findOptions(): Promise<SupplierOption[]> {
        return prisma.supplier.findMany({
            where: { is_active: true },
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        });
    }

    async findById(id: number): Promise<Supplier | null> {
        const row = await findSupplierRow(id);
        return row ? toSupplier(row) : null;
    }

    // Revisa en UNA consulta si otro proveedor ya usa el nombre, el documento o el NRC.
    // Devuelve el texto del campo repetido (ej. "el NRC") o null si no hay conflicto.
    // excludeId permite que un proveedor conserve sus propios datos al editar.
    async findDuplicateField(data: SupplierData, excludeId?: number): Promise<string | null> {
        const existing = await prisma.supplier.findFirst({
            where: {
                OR: [
                    { name: data.name },
                    { document_type: data.document_type, document_number: data.document_number },
                    ...(data.nrc ? [{ nrc: data.nrc }] : [])
                ],
                ...(excludeId ? { NOT: { id: excludeId } } : {})
            },
            select: { name: true, document_type: true, document_number: true, nrc: true }
        });

        if (!existing) return null;

        // MySQL compara el nombre sin distinguir mayúsculas, así que aquí también
        if (existing.name.toLowerCase() === data.name.toLowerCase()) return 'ese nombre';
        if (existing.document_type === data.document_type && existing.document_number === data.document_number) {
            return 'ese número de documento';
        }
        return 'ese NRC';
    }

    async create(data: SupplierData): Promise<Supplier> {
        const row = await prisma.supplier.create({ data, select: SUPPLIER_SELECT });
        return toSupplier(row);
    }

    async update(id: number, data: UpdateSupplierData): Promise<Supplier> {
        const row = await prisma.supplier.update({ where: { id }, data, select: SUPPLIER_SELECT });
        return toSupplier(row);
    }
}
