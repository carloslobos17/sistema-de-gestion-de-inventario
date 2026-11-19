import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite reenvía /api al backend: el navegador ve un solo origen (sin CORS y con la cookie
// de sesión funcionando igual por localhost que por la IP de la red). En producción lo hace nginx.
const apiProxy = {
  '/api': { target: 'http://localhost:3000', changeOrigin: true },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: { host: true, proxy: apiProxy }, // host: true = se puede abrir desde otros equipos de la red
  preview: { host: true, proxy: apiProxy },
})
