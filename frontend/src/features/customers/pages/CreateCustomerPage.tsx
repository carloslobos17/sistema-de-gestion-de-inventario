// src/features/customers/pages/CreateCustomerPage.tsx
// 👤 DUEÑO: Persona 1
// Página /customers/create. Para CUALQUIER usuario con sesión; el límite de crédito solo lo edita el admin.
// Error → toast rojo y el formulario conserva lo escrito. Éxito → toast verde y vuelve a /customers.
// Referencia: src/features/suppliers/pages/CreateSupplierPage.tsx
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader } from "../../../components/layout/PageHeader";
import { BackLink } from "../../../components/ui/BackLink";
import { useCanManageStructure } from "../../auth/hooks/useCanManageStructure";
import { CustomerForm } from "../components/form/CustomerForm";
import { useCreateCustomer } from "../hooks/useCreateCustomer";
import type { CustomerFormValues } from "../model/customers.types";

export function CreateCustomerPage() {
    const navigate = useNavigate();
    const canEditCreditLimit = useCanManageStructure();

    const { createCustomer, isSaving } = useCreateCustomer();

    const handleSubmit = async (values: CustomerFormValues) => {
        const result = await createCustomer(values, canEditCreditLimit);

        // Error (409 documento o NRC repetido, 403 sin permiso...): el formulario conserva lo escrito
        if (result.ok === false) {
            toast.error(result.error);
            return;
        }

        toast.success("Cliente creado exitosamente");
        navigate("/customers");
    };

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6">
            <BackLink to="/customers" label="Volver a clientes" />

            <PageHeader title="Nuevo cliente" description="Registra los datos del cliente. Solo el nombre es obligatorio para un consumidor final." />

            {/* Sin overflow-hidden: si no, el pie fijo (sticky) del formulario no funciona */}
            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
                <CustomerForm
                    mode="create"
                    isSaving={isSaving}
                    canEditCreditLimit={canEditCreditLimit}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/customers")}
                />
            </div>
        </div>
    );
}
