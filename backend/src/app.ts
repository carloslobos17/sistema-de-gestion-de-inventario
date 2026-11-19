// src/app.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import brandRoutes from './modules/brands/brand.routes';
import categoryRoutes from './modules/categories/category.routes';
import unitRoutes from './modules/units/unit.routes';
import locationRoutes from './modules/locations/location.routes';
import supplierRoutes from './modules/suppliers/supplier.routes';
import economicActivityRoutes from './modules/economic-activities/economic-activity.routes';
import paymentMethodRoutes from './modules/payment-methods/payment-method.routes';
import customerRoutes from './modules/customers/customer.routes';

const app = express();

// CORS solo si el frontend vive en otro dominio (CORS_ORIGINS en el .env, separados por coma).
// Con el proxy de Vite o con nginx, frontend y backend comparten dominio y no hace falta.
const corsOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
if (corsOrigins.length > 0) app.use(cors({ origin: corsOrigins, credentials: true }));

// Middlewares globales
app.use(express.json());
app.use(cookieParser()); // lee la cookie httpOnly del refresh token

// Health Check (Verificación de estado)
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'online',
        message: 'Backend de Constru-Industrias Martínez funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Rutas de la API
app.use('/api/auth', authRoutes); // login, refresh y logout

app.use('/api/users', userRoutes); // lista de usuarios (protegida por token)
app.use('/api/brands', brandRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/economic-activities', economicActivityRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);
app.use('/api/customers', customerRoutes);

export default app; // Exportamos la app configurada
