// src/features/users/pages/EditUserPage.tsx
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../../components/layout/PageHeader";
import { UserForm } from "../components/UserForm";
import { useUser } from "../hooks/useUser";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { toUserFormValues } from "../model/users.mappers";
import type { UserFormValues } from "../model/users.types";

export function EditUserPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { user, isLoading, error: loadError } = useUser(Number(id));
    const { updateUser, isSaving, error: saveError } = useUpdateUser();

    const handleSubmit = async (values: UserFormValues) => {
        if (!user) return;
        const result = await updateUser(user, values);
        if (result.ok) {
            toast.success(`Cambios de @${result.data.username} guardados`);
            navigate("/users");
        }
    };

    return (
        <div className="mx-auto w-full max-w-4xl space-y-6">
            <Link
                to="/users"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200 focus:ring-offset-2"
            >
                <ArrowLeft className="h-4 w-4" />
                Volver a la lista
            </Link>

            <PageHeader
                title="Editar Usuario"
                description={
                    user
                        ? `Modifica los datos y permisos de ${user.first_name} ${user.last_name} (@${user.username}).`
                        : "Modifica los datos y permisos de la cuenta."
                }
            />

            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                    </div>
                ) : loadError || !user ? (
                    <div className="space-y-4 p-8 text-center">
                        <p className="text-sm text-red-700">{loadError ?? "No se encontró el usuario."}</p>
                        <Link to="/users" className="text-sm font-medium text-zinc-600 underline hover:text-zinc-900">
                            Volver a la lista de usuarios
                        </Link>
                    </div>
                ) : (
                    <UserForm
                        key={user.id}
                        mode="edit"
                        initialValues={toUserFormValues(user)}
                        isSaving={isSaving}
                        error={saveError}
                        onSubmit={handleSubmit}
                        onCancel={() => navigate("/users")}
                    />
                )}
            </div>
        </div>
    );
}