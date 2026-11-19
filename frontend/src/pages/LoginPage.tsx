// src/pages/LoginPage.tsx
// Pantalla de inicio de sesión. Al entrar, GuestRoute lleva a la página que se quería abrir (o al dashboard).
import { LoginForm } from "../features/auth/components/LoginForm";
import { useLogin } from "../features/auth/hooks/useLogin";
import { useAuthSession } from "../features/auth/hooks/useAuthSession";
import { SESSION_END_MESSAGES } from "../features/auth/auth.constants";

export function LoginPage() {
    const { login } = useLogin();
    const { endReason } = useAuthSession();
    const endMessage = endReason ? SESSION_END_MESSAGES[endReason] : undefined;

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Sistema de Gestión de Inventario
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Ingresa tus credenciales para continuar
                    </p>
                </div>

                {/* Por qué se cerró la sesión anterior (vencida o por inactividad) */}
                {endMessage && (
                    <div role="status" className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                        {endMessage}
                    </div>
                )}

                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <LoginForm onSubmit={login} />
                </div>
            </div>
        </div>
    );
}
