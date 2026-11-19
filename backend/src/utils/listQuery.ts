// src/utils/listQuery.ts
// Paginado rápido para tablas grandes, en dos pasos:
//   1) SQL directo: solo los ids de la página + el total (usa los índices, incluso en páginas profundas)
//   2) Prisma trae los datos completos SOLO de esos ids (10 filas, no la tabla entera)
import { Prisma } from '@prisma/client';
import { prisma } from '../config/db';
import { getSkip } from './pagination';
import type { PaginationParams } from '../types/pagination.types';

// Solo tablas conocidas (nunca texto del usuario): el nombre de tabla no se puede pasar como parámetro
export type ListTable = 'customers' | 'suppliers';

export interface PageIds {
    ids: number[];
    total: number;
}

export async function findPageIds(
    table: ListTable,
    conditions: Prisma.Sql[],
    pagination: PaginationParams
): Promise<PageIds> {
    const tableSql = Prisma.raw(`\`${table}\``);
    const whereSql = conditions.length > 0 ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}` : Prisma.empty;

    // Las dos consultas a la vez: el total y los ids de la página (orden estable: nombre y luego id)
    const [countRows, idRows] = await Promise.all([
        prisma.$queryRaw<{ total: bigint }[]>`SELECT COUNT(*) AS total FROM ${tableSql} ${whereSql}`,
        prisma.$queryRaw<{ id: number }[]>`
            SELECT id FROM ${tableSql} ${whereSql}
            ORDER BY name ASC, id ASC
            LIMIT ${pagination.limit} OFFSET ${getSkip(pagination)}`,
    ]);

    return { ids: idRows.map((row) => Number(row.id)), total: Number(countRows[0]?.total ?? 0) };
}

// Devuelve las filas en el mismo orden que los ids (el IN de SQL no garantiza el orden)
export function sortByIds<T extends { id: number }>(rows: T[], ids: number[]): T[] {
    const byId = new Map(rows.map((row) => [row.id, row]));
    return ids.map((id) => byId.get(id)).filter((row): row is T => row !== undefined);
}
