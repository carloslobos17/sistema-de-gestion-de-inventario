// src/types/express.d.ts
import { JwtPayload } from '../modules/auth/auth.types';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}