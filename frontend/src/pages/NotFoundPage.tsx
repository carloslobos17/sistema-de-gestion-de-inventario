// src/pages/NotFoundPage.tsx
import { Link } from "react-router-dom";

export function NotFoundPage() {
    return (
        <div className="mx-auto flex max-w-md flex-col items-center py-24 text-center">
            <p className="text-5xl font-bold text-slate-300">404</p>
            <h1 className="mt-4 text-xl font-semibold text-slate-900">Página no encontrada</h1>
            <p className="mt-2 text-sm text-slate-500">La pantalla que buscas no existe o todavía no está disponible.</p>
            <Link
                to="/dashboard"
                className="mt-6 inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
                Ir al Dashboard
            </Link>
        </div>
    );
}
