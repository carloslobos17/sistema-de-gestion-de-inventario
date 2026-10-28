// src/modules/units/unit.controller.ts
import { Request, Response } from 'express';
import { UnitService } from './unit.service';

const unitService = new UnitService();

export class UnitController {
    // GET /api/units  →  [{ id, name }] (catálogo de Hacienda, para el select de productos)
    async list(_req: Request, res: Response): Promise<void> {
        try {
            const units = await unitService.list();
            res.status(200).json({ data: units });
        } catch (error) {
            console.error('[UnitController - list] Error interno:', error);
            res.status(500).json({ error: 'Error interno del servidor. Contacte al administrador.' });
        }
    }
}
