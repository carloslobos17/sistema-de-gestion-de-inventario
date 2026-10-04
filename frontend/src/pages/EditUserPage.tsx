import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AppLayout } from "../components/layout/AppLayout";
import { PageHeader } from "../components/layout/PageHeader";


export function EditUserPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    return (
        <AppLayout>
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            >
                <ArrowLeft className="h-4 w-4" />
                Volver
            </button>

            <PageHeader
                title="Editar Usuario"
                description={`Modifica los datos de la cuenta #${id ?? ""}.`}
            />

            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-zinc-500">Formulario de edición próximamente.</p>
            </div>
        </AppLayout>
    );
}
