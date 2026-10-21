import { z } from 'zod';
import { BRAND_NAME_MAX_LENGTH, BRAND_NAME_MIN_LENGTH } from './brands.constants';

export const brandFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(BRAND_NAME_MIN_LENGTH, `El nombre debe tener al menos ${BRAND_NAME_MIN_LENGTH} caracteres`)
        .max(BRAND_NAME_MAX_LENGTH, `El nombre no puede superar los ${BRAND_NAME_MAX_LENGTH} caracteres`),
});
