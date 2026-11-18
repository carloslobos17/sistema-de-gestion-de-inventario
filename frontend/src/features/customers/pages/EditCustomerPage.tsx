import { Building2, Loader2, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { BackLink } from "../../../components/ui/BackLink";
import { useCanManageStructure } from "../../auth/hooks/useCanManageStructure";
import { CustomerForm } from "../components/form/CustomerForm";
import { useCustomer } from "../hooks/useCustomer";
import { useUpdateCustomer } from "../hooks/useUpdateCustomer";
import { toCustomerFormValues } from "../model/customers.mappers";
import type { CustomerFormValues } from "../model/customers.types";

function getCustomerTypeInfo(customerType: string) {
    const normalized = customerType.toLowerCase();
    const isTaxpayer =
        normalized === "contribuyente" ||
        normalized === "taxpayer" ||
        normalized === "juridical";

    return isTaxpayer
        ? {
              label: "Contribuyente",
              Icon: Building2,
              className: "bg-blue-100/80 text-slate-700",
          }
        : {
              label: "Consumidor final",
              Icon: User,
              className: "bg-zinc-100 text-zinc-700",
          };
}

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

    const { label: typeLabel, Icon: TypeIcon, className: typeClassName } = getCustomerTypeInfo(
        String(customer.customer_type)
    );

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6">
            <BackLink to="/customers" label="Volver a clientes" />
            <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                            Editar cliente
                        </h1>
                        <span className="h-5 w-px bg-zinc-300" aria-hidden="true" />
                        <span className="text-lg font-normal text-zinc-600 sm:text-xl">
                            {customer.name}
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-500">
                        Actualiza los datos del cliente.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${typeClassName}`}
                    >
                        <TypeIcon className="h-3.5 w-3.5" />
                        {typeLabel}
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
            </div>

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