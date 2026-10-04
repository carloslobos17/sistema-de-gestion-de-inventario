// src/middlewares/validator.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Usamos z.ZodTypeAny para que acepte cualquier esquema de Zod (objetos, strings, arrays)
export const validateSchema = (schema: z.ZodTypeAny) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            // Usamos la clase ZodError directamente desde 'z'
            if (error instanceof z.ZodError) {
                // En Zod, la propiedad oficial es 'issues', no 'errors' (esto quita el error de ANY)
                const zodErrors = error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }));

                res.status(400).json({
                    error: 'Datos de entrada inválidos',
                    details: zodErrors
                });
                return;
            }

            next(error);
        }
    };
};