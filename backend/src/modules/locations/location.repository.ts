// src/modules/locations/location.repository.ts
import { prisma } from '../../config/db';
import type { DepartmentNode } from './location.types';

export class LocationRepository {
    // Todo el árbol en UNA consulta (~320 filas): el frontend lo pide una vez y arma los selects en cascada
    async findTree(): Promise<DepartmentNode[]> {
        return prisma.department.findMany({
            select: {
                code: true,
                name: true,
                municipalities: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        districts: {
                            select: { id: true, code: true, name: true },
                            orderBy: { name: 'asc' }
                        }
                    },
                    orderBy: { name: 'asc' }
                }
            },
            orderBy: { code: 'asc' } // orden oficial de Hacienda (01 Ahuachapán ... 14 La Unión)
        });
    }
}
