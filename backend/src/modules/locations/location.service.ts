// src/modules/locations/location.service.ts
import { LocationRepository } from './location.repository';
import type { DepartmentNode } from './location.types';

export class LocationService {
    private locationRepository = new LocationRepository();

    async getTree(): Promise<DepartmentNode[]> {
        return this.locationRepository.findTree();
    }
}
