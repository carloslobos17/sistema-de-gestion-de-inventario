import dotenv from 'dotenv';
// 1. Cargar las variables de entorno ANTES de hacer cualquier otra cosa
dotenv.config();
import app from './app';

const PORT = process.env.PORT || 3000;

// 3. Levantar el servido
app.listen(PORT, () => {
    console.log(` Servidor ejecutándose en: http://localhost:${PORT}`);
});