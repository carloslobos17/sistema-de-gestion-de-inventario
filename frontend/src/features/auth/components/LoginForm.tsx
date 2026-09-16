import { FormField } from "../../../components/ui/FormField";
import { Button } from "../../../components/ui/Button";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { useLoginForm } from "../hooks/useLoginForm";
import type { LoginCredentials } from "../../../types/auth.types";

interface LoginFormProps {
    onSubmit: (credentials: LoginCredentials) => Promise<unknown>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
    const { formData, errors, isLoading, handleChange, handleSubmit } = useLoginForm({ onSubmit });

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <FormField
                label="Usuario"
                name="nombre_usuario"
                type="text"
                autoComplete="username"
                placeholder="Ej. admin"
                required
                value={formData.nombre_usuario}
                error={errors.nombre_usuario}
                onChange={(e) => handleChange("nombre_usuario", e.target.value)}
            />

            <FormField
                label="Contraseña"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
                value={formData.password}
                error={errors.password}
                onChange={(e) => handleChange("password", e.target.value)}
            />

            {errors.general && (
                <div className="rounded-md bg-red-50 px-3 py-2">
                    <ErrorMessage message={errors.general} />
                </div>
            )}

            <Button type="submit" isLoading={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
        </form>
    );
}