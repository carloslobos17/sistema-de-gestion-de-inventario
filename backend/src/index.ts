import 'dotenv/config';
import app from './app';
import { startSessionCleanup } from './modules/auth/session-cleanup';

const PORT = process.env.PORT || 3000;

// 3. Levantar el servido
app.listen(PORT, () => {
    console.log(` Servidor ejecutándose en: http://localhost:${PORT}`);
    startSessionCleanup();
});