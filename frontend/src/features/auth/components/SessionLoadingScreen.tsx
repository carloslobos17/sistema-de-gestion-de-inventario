// src/features/auth/components/SessionLoadingScreen.tsx
// Pantalla breve mientras se recupera la sesión al abrir o recargar la app.
export function SessionLoadingScreen() {
    return (
        <div role="status" className="flex min-h-screen items-center justify-center bg-slate-50">
            <p className="text-sm text-slate-500">Cargando sesión...</p>
        </div>
    );
}
