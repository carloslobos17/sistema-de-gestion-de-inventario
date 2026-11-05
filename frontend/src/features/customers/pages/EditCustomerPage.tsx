// src/features/customers/pages/EditCustomerPage.tsx
// 👤 DUEÑO: Persona 3
// Página /customers/:id/edit. Para CUALQUIER usuario con sesión; el límite de crédito solo lo edita el admin.
//
// TODO (Persona 3):
//   [ ] useCustomer(Number(id)) para cargar el cliente: Loader2 mientras carga; si falla, mensaje + BackLink.
//   [ ] Encabezado como en Stitch: "Editar cliente", el nombre del cliente y sus insignias de tipo y estado.
//       Descripción: "Actualiza los datos del cliente."
//   [ ] <CustomerForm key={customer.id} mode="edit" initialValues={toCustomerFormValues(customer)}
//         canEditCreditLimit={canEditCreditLimit} isSaving={isSaving} ... />
//   [ ] handleSubmit con useUpdateCustomer: error → toast.error; si cambió algo → toast.success("Cambios guardados");
//       luego navigate("/customers").
//   [ ] Contenedor del formulario: "rounded-xl border border-zinc-200 bg-white shadow-sm" SIN overflow-hidden
//       (si no, el pie fijo/sticky del formulario no funciona). Igual que CreateCustomerPage.
//   Referencia: src/features/suppliers/pages/EditSupplierPage.tsx
import { useParams } from "react-router-dom";
import { PageHeader } from "../../../components/layout/PageHeader";
import { BackLink } from "../../../components/ui/BackLink";
import { useCanManageStructure } from "../../auth/hooks/useCanManageStructure";

export function EditCustomerPage() {
    const { id } = useParams<{ id: string }>();
    const canEditCreditLimit = useCanManageStructure();

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6">
            <BackLink to="/customers" label="Volver a clientes" />

            <PageHeader title="Editar cliente" description="Actualiza los datos del cliente." />

            <p className="rounded-md border border-dashed border-amber-300 bg-amber-50 p-6 text-sm text-amber-700">
                TODO Persona 3: cargar el cliente #{id} y mostrar el formulario ({canEditCreditLimit ? "admin" : "vendedor"}).
            </p>
        </div>
    );
}
