// src/modules/economic-activities/economic-activity.controller.ts
import { Request, Response } from 'express';
import { EconomicActivityService } from './economic-activity.service';

const economicActivityService = new EconomicActivityService();

export class EconomicActivityController {
    // GET /api/economic-activities  →  [{ code, name }] (catálogo de Hacienda, para proveedores y clientes)
    async list(_req: Request, res: Response): Promise<void> {
        try {
            const activities = await economicActivityService.list();
            res.status(200).json({ data: activities });
        } catch (error) {
            console.error('[EconomicActivityController - list] Error interno:', error);
            res.status(500).json({ error: 'Error interno del servidor. Contacte al administrador.' });
        }
    }
}
