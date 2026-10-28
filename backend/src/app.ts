// src/app.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import brandRoutes from './modules/brands/brand.routes';
import categoryRoutes from './modules/categories/category.routes';
import unitRoutes from './modules/units/unit.routes';
import locationRoutes from './modules/locations/location.routes';
import supplierRoutes from './modules/suppliers/supplier.routes';
import economicActivityRoutes from './modules/economic-activities/economic-activity.routes';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Health Check (Verificación de estado)
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'online',
        message: 'Backend de Constru-Industrias Martínez funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Rutas de la API
app.use('/api/auth', authRoutes); // login

app.use('/api/users', userRoutes); // lista de usuarios (protegida por token)
app.use('/api/brands', brandRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/economic-activities', economicActivityRoutes);

export default app; // Exportamos la app configurada 