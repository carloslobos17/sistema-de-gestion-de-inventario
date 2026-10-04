import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AppLayout } from "../components/layout/AppLayout";
import { PageHeader } from "../components/layout/PageHeader";

export function CreateUserPage() {
    return (
        <AppLayout>
            <Link
                to="/users"
                className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            >
                <ArrowLeft className="h-4 w-4" />
                Volver
            </Link>

            <PageHeader
                title="Nuevo Usuario"
                description="Completa los datos para registrar una nueva cuenta de empleado."
            />

            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-zinc-500">Formulario de creación próximamente.</p>
            </div>
        </AppLayout>
    );
}
