// src/features/customers/pages/CreateCustomerPage.tsx
// 👤 DUEÑO: Persona 1
// Página /customers/create. Para CUALQUIER usuario con sesión; el límite de crédito solo lo edita el admin.
//
// TODO (Persona 1):
//   [ ] handleSubmit: const result = await createCustomer(values, canEditCreditLimit) (useCreateCustomer).
//       Error → toast.error(result.error) y el formulario conserva lo escrito.
//       Éxito → toast.success("Cliente creado exitosamente") y navigate("/customers").
//   Referencia: src/features/suppliers/pages/CreateSupplierPage.tsx
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader } from "../../../components/layout/PageHeader";
import { BackLink } from "../../../components/ui/BackLink";
import { useCanManageStructure } from "../../auth/hooks/useCanManageStructure";
import { CustomerForm } from "../components/form/CustomerForm";
import type { CustomerFormValues } from "../model/customers.types";

export function CreateCustomerPage() {
    const navigate = useNavigate();
    const canEditCreditLimit = useCanManageStructure();

    // TODO (Persona 1): usar useCreateCustomer
    const handleSubmit = (values: CustomerFormValues) => {
        toast.info(`Pendiente: guardar a ${values.name} (CreateCustomerPage)`);
    };

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6">
            <BackLink to="/customers" label="Volver a clientes" />

            <PageHeader title="Nuevo cliente" description="Registra los datos del cliente. Solo el nombre es obligatorio para un consumidor final." />

            {/* Sin overflow-hidden: si no, el pie fijo (sticky) del formulario no funciona */}
            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
                <CustomerForm
                    mode="create"
                    isSaving={false}
                    canEditCreditLimit={canEditCreditLimit}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/customers")}
                />
            </div>
        </div>
    );
}
