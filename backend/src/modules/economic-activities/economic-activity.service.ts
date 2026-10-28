// src/modules/economic-activities/economic-activity.service.ts
import { EconomicActivityRepository } from './economic-activity.repository';
import type { EconomicActivity } from './economic-activity.types';

export class EconomicActivityService {
    private economicActivityRepository = new EconomicActivityRepository();

    async list(): Promise<EconomicActivity[]> {
        return this.economicActivityRepository.findAll();
    }
}
