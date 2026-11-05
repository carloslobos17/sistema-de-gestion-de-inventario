// src/features/customers/components/form/CustomerFiscalSection.tsx
// 👤 DUEÑO: Persona 2
// Datos fiscales (SOLO contribuyente; CustomerForm ya la oculta para consumidor final): NRC y actividad económica.
//
// TODO (Persona 2):
//   [ ] "NRC" obligatorio: FormField name="nrc", inputMode="numeric", placeholder "123456-7", maxLength 10.
//   [ ] "Actividad económica" obligatoria: <EconomicActivitySelect> con <Label required> y <ErrorMessage>
//       (src/features/economic-activities/components/EconomicActivitySelect.tsx). Se guarda con setField("economic_activity_code", code).
//   [ ] Distribución sugerida (3 columnas): NRC (1 col) + Actividad económica (md:col-span-2, es un texto largo).
//   Referencia: sección "Datos fiscales" de SupplierForm.tsx (sin la casilla de percepción: eso es solo de proveedores)
import type { CustomerFormSectionProps } from "../../model/customers.types";
import { FormSection } from "./FormSection";

export function CustomerFiscalSection({ values }: CustomerFormSectionProps) {
    return (
        <FormSection title="Datos fiscales" description="Datos de inscripción en IVA ante el Ministerio de Hacienda.">
            <p className="rounded-md border border-dashed border-amber-300 bg-amber-50 p-3 text-xs text-amber-700 md:col-span-3">
                TODO Persona 2: NRC y actividad económica (valores actuales: NRC «{values.nrc || "—"}», actividad «
                {values.economic_activity_code || "—"}»).
            </p>
        </FormSection>
    );
}
