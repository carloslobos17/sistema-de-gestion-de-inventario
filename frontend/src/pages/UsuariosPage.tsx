import { PageHeader } from "../components/layout/PageHeader";
import { Button } from "../components/ui/Button";
import { UserTable } from "../features/usuarios/components/UserTable";
import { useUsuarios } from "../features/usuarios/hooks/useUsuarios";

export function UsuariosPage() {
    const { usuarios, isLoading, error } = useUsuarios();

    return (
        <>
            <PageHeader
                title="Gestión de Usuarios"
                description="Administra las cuentas de empleados, accesos y permisos al sistema."
                action={<Button className="w-full sm:w-auto px-4">+ Nuevo Usuario</Button>}
            />

            {isLoading && (
                <p className="py-10 text-center text-sm text-slate-500">Cargando usuarios...</p>
            )}

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {!isLoading && !error && (
                usuarios.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500">
                        Aún no hay usuarios registrados.
                    </p>
                ) : (
                    <UserTable usuarios={usuarios} />
                )
            )}
        </>
    );
}