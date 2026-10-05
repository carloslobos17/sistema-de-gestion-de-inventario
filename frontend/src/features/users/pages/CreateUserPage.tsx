// src/features/users/pages/CreateUserPage.tsx
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../../components/layout/PageHeader";
import { UserForm } from "../components/UserForm";
import { useCreateUser } from "../hooks/useCreateUser";
import type { UserFormValues } from "../model/users.types";

export function CreateUserPage() {
    const navigate = useNavigate();
    const { createUser, isSaving, error } = useCreateUser();

    const handleSubmit = async (values: UserFormValues) => {
        const result = await createUser(values);
        if (result.ok) {
            toast.success(`Usuario @${result.data.username} creado`);
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

            <PageHeader title="Nuevo Usuario" description="Completa los datos para registrar una nueva cuenta de empleado." />

            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <UserForm
                    mode="create"
                    isSaving={isSaving}
                    error={error}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/users")}
                />
            </div>
        </div>
    );
}