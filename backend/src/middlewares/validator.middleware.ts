// src/middlewares/validator.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

type Source = 'body' | 'params';

export const validateSchema = (schema: z.ZodTypeAny, source: Source = 'body') => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
            const details = result.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message
            }));

            res.status(400).json({
                error: 'Datos de entrada inválidos',
                details
            });
            return;
        }

        (req as any)[source] = result.data;
        next();
    };
};