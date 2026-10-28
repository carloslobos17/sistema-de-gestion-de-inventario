// src/modules/units/unit.service.ts
import { UnitRepository } from './unit.repository';
import type { UnitOfMeasure } from './unit.types';

export class UnitService {
    private unitRepository = new UnitRepository();

    async list(): Promise<UnitOfMeasure[]> {
        return this.unitRepository.findAll();
    }
}
