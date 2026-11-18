// src/features/customers/pages/EditCustomerPage.tsx
// Página /customers/:id/edit. Carga el cliente, muestra el formulario y envía solo los campos que cambiaron.
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader } from "../../../components/layout/PageHeader";
import { BackLink } from "../../../components/ui/BackLink";
import { useCanManageStructure } from "../../auth/hooks/useCanManageStructure";
import { CustomerForm } from "../components/form/CustomerForm";
import { useCustomer } from "../hooks/useCustomer";
import { useUpdateCustomer } from "../hooks/useUpdateCustomer";
import { CUSTOMER_TYPE_BADGE_CLASSES, CUSTOMER_TYPE_LABELS } from "../model/customers.constants";
import { toCustomerFormValues } from "../model/customers.mappers";
import type { CustomerFormValues } from "../model/customers.types";

export function EditCustomerPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const canEditCreditLimit = useCanManageStructure();

    const { customer, isLoading, error } = useCustomer(Number(id));
    const { updateCustomer, isSaving } = useUpdateCustomer();

    const handleSubmit = async (values: CustomerFormValues) => {
        if (!customer) return;

        const result = await updateCustomer(customer, values, canEditCreditLimit);

        if (!result.ok) {
            toast.error(result.error);
            return;
        }

        if (result.data !== customer) {
            toast.success("Cambios guardados");
        }

        navigate("/customers");
    };

    if (isLoading) {
        return (
            <div className="mx-auto w-full max-w-6xl space-y-6">
                <BackLink to="/customers" label="Volver a clientes" />
                <div className="flex min-h-60 flex-col items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
                    <Loader2 className="h-7 w-7 animate-spin text-zinc-400" />
                    <p className="text-sm text-zinc-500">Cargando información del cliente...</p>
                </div>
            </div>
        );
    }

    if (error || !customer) {
        return (
            <div className="mx-auto w-full max-w-6xl space-y-6">
                <BackLink to="/customers" label="Volver a clientes" />
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
                    <p className="font-medium">{error ?? "No se pudo cargar el cliente."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6">
            <BackLink to="/customers" label="Volver a clientes" />

            <PageHeader
                title="Editar cliente"
                description="Actualiza los datos del cliente."
                action={
                    <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-sm font-medium text-zinc-700">{customer.name}</span>

                        <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${CUSTOMER_TYPE_BADGE_CLASSES[customer.customer_type]}`}
                        >
                            {CUSTOMER_TYPE_LABELS[customer.customer_type]}
                        </span>

                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                                customer.is_active
                                    ? "border-emerald-200 bg-emerald-50/70 text-emerald-700"
                                    : "border-rose-200 bg-rose-50/70 text-rose-700"
                            }`}
                        >
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                    customer.is_active ? "bg-emerald-500" : "bg-rose-500"
                                }`}
                            />
                            {customer.is_active ? "Activo" : "Inactivo"}
                        </span>
                    </div>
                }
            />

            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
                <CustomerForm
                    key={customer.id}
                    mode="edit"
                    initialValues={toCustomerFormValues(customer)}
                    canEditCreditLimit={canEditCreditLimit}
                    isSaving={isSaving}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/customers")}
                />
            </div>
        </div>
    );
}