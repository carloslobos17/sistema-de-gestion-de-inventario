import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initSession } from './features/auth/session/sessionManager'

// Recupera la sesión con la cookie antes de pintar la app (una sola vez, también en StrictMode)
initSession()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
