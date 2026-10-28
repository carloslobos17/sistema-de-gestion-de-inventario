// src/modules/suppliers/supplier.repository.ts
import { prisma } from '../../config/db';
import { getSkip, toPaginationMeta } from '../../utils/pagination';
import type { PaginatedResult, PaginationParams } from '../../types/pagination.types';
import type { Supplier, SupplierData, SupplierFilters, SupplierOption, UpdateSupplierData } from './supplier.types';

// Tipo del "where" de Prisma para proveedores, sacado de tu propio cliente
type SupplierWhere = NonNullable<NonNullable<Parameters<typeof prisma.supplier.findMany>[0]>['where']>;

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
    // Una página del listado + el total. Usa el índice (is_active, name).
    async findPage(filters: SupplierFilters, pagination: PaginationParams): Promise<PaginatedResult<Supplier>> {
        const where: SupplierWhere = {};

        if (filters.is_active !== undefined) {
            where.is_active = filters.is_active;
        }

        if (filters.supplier_type) {
            where.supplier_type = filters.supplier_type;
        }

        // Busca por nombre, razón social o contacto; si el texto trae números, también por documento y NRC
        if (filters.search) {
            const digits = filters.search.replace(/\D/g, '');
            where.OR = [
                { name: { contains: filters.search } },
                { legal_name: { contains: filters.search } },
                { contact_name: { contains: filters.search } },
                { document_number: { contains: filters.search.replace(/\s+/g, '') } },
                ...(digits ? [{ document_number: { contains: digits } }, { nrc: { contains: digits } }] : [])
            ];
        }

        // Las dos consultas en una transacción para que el total cuadre con los datos
        const [rows, total] = await prisma.$transaction([
            prisma.supplier.findMany({
                where,
                select: SUPPLIER_SELECT,
                orderBy: { name: 'asc' },
                skip: getSkip(pagination),
                take: pagination.limit
            }),
            prisma.supplier.count({ where })
        ]);

        return { data: rows.map(toSupplier), meta: toPaginationMeta(pagination, total) };
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
