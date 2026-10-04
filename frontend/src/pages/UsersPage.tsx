import { Link } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { PageHeader } from "../components/layout/PageHeader";
import { UserTable } from "../features/users/components/UserTable";
import { useUsers } from "../features/users/hooks/useUsers";

export function UsersPage() {
    const { users, isLoading, error } = useUsers();

    return (
        <AppLayout>
            {/* 1. Un contenedor que limite el ancho máximo para que no se estire demasiado en pantallas gigantes */}
            <div className="mx-auto w-full max-w-7xl space-y-6">

                <PageHeader
                    title="Gestión de Usuarios"
                    description="Administra las cuentas de empleados, accesos y permisos al sistema."
                    action={
                        <Link
                            to="/users/create"
                            className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 sm:w-auto"
                        >
                            + Nuevo Usuario
                        </Link>
                    }
                />

                {isLoading && (
                    <div className="flex justify-center py-12">
                        <p className="text-sm text-zinc-500">Cargando usuarios...</p>
                    </div>
                )}

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
                        {error}
                    </div>
                )}

                {!isLoading && !error && (
                    users.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center shadow-sm">
                            <p className="text-sm text-zinc-500">Aún no hay usuarios registrados.</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                            <UserTable users={users} />
                        </div>
                    )
                )}
            </div>
        </AppLayout>
    );
}