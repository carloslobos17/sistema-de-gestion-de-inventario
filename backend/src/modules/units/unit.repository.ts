// src/modules/units/unit.repository.ts
import { prisma } from '../../config/db';
import type { UnitOfMeasure } from './unit.types';

export class UnitRepository {
    // Catálogo completo (40 filas fijas): sin paginar ni contar
    async findAll(): Promise<UnitOfMeasure[]> {
        return prisma.unitOfMeasure.findMany({
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        });
    }
}
