// src/features/auth/components/IdleWarningDialog.tsx
// Aviso "¿Sigues ahí?" con la cuenta regresiva antes de cerrar la sesión por inactividad.
import type { IdleWarningDialogProps } from '../auth.types';

export function IdleWarningDialog({ secondsLeft, onStay, onLogout }: IdleWarningDialogProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="idle-warning-title"
                aria-describedby="idle-warning-description"
                className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-lg"
            >
                <h2 id="idle-warning-title" className="text-lg font-bold text-slate-900">
                    ¿Sigues ahí?
                </h2>
                <p id="idle-warning-description" className="mt-2 text-sm text-slate-600">
                    Por seguridad, tu sesión se cerrará en{' '}
                    <span className="font-semibold text-slate-900">{secondsLeft} segundos</span> por inactividad.
                </p>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onLogout}
                        className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    >
                        Cerrar sesión
                    </button>
                    <button
                        type="button"
                        onClick={onStay}
                        autoFocus
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    >
                        Sigo aquí
                    </button>
                </div>
            </div>
        </div>
    );
}
