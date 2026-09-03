import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'online',
        message: 'Backend de Constru-Industrias Martínez funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(` Servidor ejecutándose en: http://localhost:${PORT}`);
});