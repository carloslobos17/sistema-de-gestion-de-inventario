// src/modules/economic-activities/economic-activity.repository.ts
import { prisma } from '../../config/db';
import type { EconomicActivity } from './economic-activity.types';

export class EconomicActivityRepository {
    // Catálogo completo (773 filas fijas, ~60 KB): el frontend lo pide una vez y busca en memoria
    async findAll(): Promise<EconomicActivity[]> {
        return prisma.economicActivity.findMany({
            select: { code: true, name: true },
            orderBy: { name: 'asc' }
        });
    }
}
