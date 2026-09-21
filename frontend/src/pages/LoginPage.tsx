import { useNavigate } from "react-router-dom";
import { LoginForm } from "../features/auth/components/LoginForm";
import { useLogin } from "../features/auth/hooks/useLogin";
import type { LoginCredentials } from "../features/auth/auth.types.ts";

export function LoginPage() {
    const { login } = useLogin();
    const navigate = useNavigate();

    async function handleLogin(credentials: LoginCredentials) {
        await login(credentials);
        navigate("/usuarios");
    }

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

                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <LoginForm onSubmit={handleLogin} />
                </div>
            </div>
        </div>
    );
}