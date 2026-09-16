// src/app.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';

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
app.use('/api/auth', authRoutes); // Conecta las rutas de login

export default app; // Exportamos la app configurada