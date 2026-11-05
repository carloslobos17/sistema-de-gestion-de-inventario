// src/features/customers/components/form/CustomerGeneralSection.tsx
// 👤 DUEÑO: Persona 2
// Datos generales: nombre / razón social, nombre comercial, documento y género.
//
// TODO (Persona 2):
//   [ ] Etiqueta del nombre según el tipo: "Nombre completo" (consumidor final) / "Razón social" (contribuyente).
//       Placeholder: "Ej. Carlos Ernesto Benítez Morales" / "Ej. Ferretería El Sol, S.A. de C.V."
//   [ ] "Nombre comercial" (trade_name): SOLO contribuyente, opcional.
//   [ ] <DocumentFields> (src/features/fiscal/components/DocumentFields.tsx) con:
//         allowedTypes={ALLOWED_DOCUMENT_TYPES[values.customer_type]}
//         consumidor final → required={false} emptyOptionLabel="Sin documento"
//         contribuyente    → required (por defecto) → solo NIT y DUI
//   [ ] "Género": <Select> opcional con placeholder "Sin especificar" y GENDER_OPTIONS.
//   [ ] Sin "(opcional)" en las etiquetas: solo los obligatorios llevan asterisco.
//   [ ] Límites de largo: CUSTOMER_LIMITS (maxLength).
//   [ ] Distribución sugerida (3 columnas): Nombre (2 col) + Género · Nombre comercial (2 col) · Tipo doc + Número.
//   Referencia: sección "Datos generales" de SupplierForm.tsx
import { FormField } from "../../../../components/ui/FormField";
import { CUSTOMER_LIMITS } from "../../model/customers.constants";
import type { CustomerFormSectionProps } from "../../model/customers.types";
import { FormSection } from "./FormSection";

export function CustomerGeneralSection({ values, errors, handleChange, disabled }: CustomerFormSectionProps) {
    const isTaxpayer = values.customer_type === "Taxpayer";

    return (
        <FormSection title="Datos generales" description="Identificación del cliente.">
            {/* Ejemplo ya funcionando: el nombre. Completar el resto de campos. */}
            <div className="md:col-span-2">
                <FormField
                    label={isTaxpayer ? "Razón social" : "Nombre completo"}
                    name="name"
                    required
                    autoFocus
                    maxLength={CUSTOMER_LIMITS.NAME_MAX}
                    value={values.name}
                    onChange={handleChange}
                    disabled={disabled}
                    error={errors.name}
                />
            </div>

            <p className="rounded-md border border-dashed border-amber-300 bg-amber-50 p-3 text-xs text-amber-700 md:col-span-3">
                TODO Persona 2: nombre comercial, documento y género.
            </p>
        </FormSection>
    );
}
