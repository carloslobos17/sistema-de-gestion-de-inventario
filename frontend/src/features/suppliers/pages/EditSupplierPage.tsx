// src/features/suppliers/pages/EditSupplierPage.tsx
// Página /suppliers/:id/edit. Solo para roles con can_manage_structure (lo protege la ruta).
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../../components/layout/PageHeader";
import { BackLink } from "../../../components/ui/BackLink";
import { SupplierForm } from "../components/SupplierForm";
import { useSupplier } from "../hooks/useSupplier";
import { useUpdateSupplier } from "../hooks/useUpdateSupplier";
import { toSupplierFormValues } from "../model/suppliers.mappers";
import type { SupplierFormValues } from "../model/suppliers.types";

export function EditSupplierPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { supplier, isLoading, error: loadError } = useSupplier(Number(id));
    const { updateSupplier, isSaving } = useUpdateSupplier();

    const handleSubmit = async (values: SupplierFormValues) => {
        if (!supplier) return;
        const result = await updateSupplier(supplier, values);

        if (result.ok === false) {
            toast.error(result.error);
            return;
        }

        // Si no cambió nada, el hook no llamó al backend: solo se regresa, sin toast
        if (result.data !== supplier) {
            toast.success(`Cambios de ${result.data.name} guardados`);
        }
        navigate("/suppliers");
    };

    return (
        <div className="mx-auto w-full max-w-4xl space-y-6">
            <BackLink to="/suppliers" />

            <PageHeader
                title="Editar proveedor"
                description={supplier ? `Modifica los datos de ${supplier.name}.` : "Modifica los datos del proveedor."}
            />

            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                    </div>
                ) : loadError || !supplier ? (
                    <div className="space-y-4 p-8 text-center">
                        <p className="text-sm text-red-700">{loadError ?? "No se encontró el proveedor."}</p>
                        <BackLink to="/suppliers" label="Volver a la lista de proveedores" />
                    </div>
                ) : (
                    <SupplierForm
                        key={supplier.id}
                        mode="edit"
                        initialValues={toSupplierFormValues(supplier)}
                        isSaving={isSaving}
                        onSubmit={handleSubmit}
                        onCancel={() => navigate("/suppliers")}
                    />
                )}
            </div>
        </div>
    );
}
