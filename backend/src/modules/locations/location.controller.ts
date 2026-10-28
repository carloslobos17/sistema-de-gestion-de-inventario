// src/modules/locations/location.controller.ts
import { Request, Response } from 'express';
import { LocationService } from './location.service';

const locationService = new LocationService();

export class LocationController {
    // GET /api/locations  →  [{ code, name, municipalities: [{ id, code, name, districts: [...] }] }]
    async tree(_req: Request, res: Response): Promise<void> {
        try {
            const departments = await locationService.getTree();
            res.status(200).json({ data: departments });
        } catch (error) {
            console.error('[LocationController - tree] Error interno:', error);
            res.status(500).json({ error: 'Error interno del servidor. Contacte al administrador.' });
        }
    }
}
