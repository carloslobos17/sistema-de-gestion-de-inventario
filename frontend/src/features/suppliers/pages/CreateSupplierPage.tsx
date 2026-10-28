// src/features/suppliers/pages/CreateSupplierPage.tsx
// Página /suppliers/create. Solo para roles con can_manage_structure (lo protege la ruta).
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader } from "../../../components/layout/PageHeader";
import { BackLink } from "../../../components/ui/BackLink";
import { SupplierForm } from "../components/SupplierForm";
import { useCreateSupplier } from "../hooks/useCreateSupplier";
import type { SupplierFormValues } from "../model/suppliers.types";

export function CreateSupplierPage() {
    const navigate = useNavigate();
    const { createSupplier, isSaving } = useCreateSupplier();

    const handleSubmit = async (values: SupplierFormValues) => {
        const result = await createSupplier(values);

        // Error (409 dato repetido, 403 sin permiso...): el formulario conserva lo escrito
        if (result.ok === false) {
            toast.error(result.error);
            return;
        }

        toast.success(`Proveedor ${result.data.name} creado`);
        navigate("/suppliers");
    };

    return (
        <div className="mx-auto w-full max-w-4xl space-y-6">
            <BackLink to="/suppliers" />

            <PageHeader title="Nuevo proveedor" description="Registra los datos de la empresa y sus datos fiscales." />

            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <SupplierForm mode="create" isSaving={isSaving} onSubmit={handleSubmit} onCancel={() => navigate("/suppliers")} />
            </div>
        </div>
    );
}
