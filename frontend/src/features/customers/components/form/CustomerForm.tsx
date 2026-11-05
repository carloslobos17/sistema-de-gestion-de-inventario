// src/features/customers/components/form/CustomerForm.tsx
// 👤 DUEÑO: Persona 1
// Formulario compartido por CreateCustomerPage y EditCustomerPage. Arma las secciones, valida y envía.
// Ya está conectado con todas las secciones: cada persona trabaja DENTRO de su sección sin tocar este archivo.
//
// TODO (Persona 1):
//   [ ] Revisar que al enviar con errores se muestren TODOS los mensajes (validate() de useCustomerForm).
//   [ ] Opcional: llevar el foco al primer campo con error al enviar.
//   Referencia: src/features/suppliers/components/SupplierForm.tsx
import { useId, type FormEvent } from "react";
import { UserPlus, Check } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { useCustomerForm } from "../../hooks/useCustomerForm";
import { CustomerTypeSection } from "./CustomerTypeSection";
import { CustomerGeneralSection } from "./CustomerGeneralSection";
import { CustomerFiscalSection } from "./CustomerFiscalSection";
import { CustomerLocationSection } from "./CustomerLocationSection";
import { CustomerContactSection } from "./CustomerContactSection";
import { CustomerCreditSection } from "./CustomerCreditSection";
import type { CustomerFormProps, CustomerFormSectionProps } from "../../model/customers.types";

export function CustomerForm({ mode, initialValues, isSaving, canEditCreditLimit, onSubmit, onCancel }: CustomerFormProps) {
    const { values, errors, setField, handleChange, changeCustomerType, validate } = useCustomerForm(initialValues);
    const formId = useId();
    const isTaxpayer = values.customer_type === "Taxpayer";

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isSaving) return;
        // Si no pasa la validación, los errores se muestran y NO se llama al backend
        if (!validate()) return;
        onSubmit(values);
    };

    // Lo mismo para todas las secciones
    const sectionProps: CustomerFormSectionProps = {
        idPrefix: formId,
        values,
        errors,
        setField,
        handleChange,
        disabled: isSaving,
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col">
            <div className="divide-y divide-zinc-100">
                <CustomerTypeSection value={values.customer_type} onChange={changeCustomerType} disabled={isSaving} />
                <CustomerGeneralSection {...sectionProps} />
                {/* Datos fiscales: solo contribuyente (si vuelve a consumidor final, la sección desaparece) */}
                {isTaxpayer && <CustomerFiscalSection {...sectionProps} />}
                <CustomerLocationSection {...sectionProps} />
                <CustomerContactSection {...sectionProps} />
                <CustomerCreditSection
                    idPrefix={formId}
                    value={values.credit_limit}
                    onChange={(value) => setField("credit_limit", value)}
                    error={errors.credit_limit}
                    canEdit={canEditCreditLimit}
                    disabled={isSaving}
                />
            </div>

            {/* Pie */}
            <div className="flex items-center justify-end gap-3 rounded-b-xl border-t border-zinc-100 bg-zinc-50/50 px-6 py-4 md:px-8">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
                    Cancelar
                </Button>
                <Button type="submit" isLoading={isSaving}>
                    {mode === "edit" ? <Check className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                    {mode === "edit" ? "Guardar cambios" : "Crear cliente"}
                </Button>
            </div>
        </form>
    );
}
