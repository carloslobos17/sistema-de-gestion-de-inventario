// src/features/customers/components/form/CustomerContactSection.tsx
// 👤 DUEÑO: Persona 2
// Contacto: teléfono principal, teléfono secundario y correo.
//   - Teléfonos: SIEMPRE opcionales (sin asterisco, sin prefijo "+503").
//   - Correo: opcional en consumidor final, OBLIGATORIO en contribuyente.
//
// TODO (Persona 2):
//   [ ] "Teléfono secundario" (phone_alt): type="tel", placeholder "2289-4500".
//   [ ] "Correo electrónico" (email): required solo si es contribuyente, type="email", placeholder "cliente@ejemplo.com".
//       Ayuda debajo: consumidor final → "Opcional. Si lo tiene, se le puede enviar la factura electrónica (DTE)."
//                     contribuyente    → "Aquí se enviará el comprobante electrónico (DTE)."
//   [ ] Distribución sugerida (3 columnas): Teléfono + Teléfono 2 + Correo en UNA sola fila.
//   [ ] maxLength: CUSTOMER_LIMITS.PHONE_MAX y CUSTOMER_LIMITS.EMAIL_MAX.
//   Referencia: sección "Contacto" de SupplierForm.tsx
import { FormField } from "../../../../components/ui/FormField";
import { CUSTOMER_LIMITS } from "../../model/customers.constants";
import type { CustomerFormSectionProps } from "../../model/customers.types";
import { FormSection } from "./FormSection";

export function CustomerContactSection({ values, errors, handleChange, disabled }: CustomerFormSectionProps) {
    return (
        <FormSection title="Contacto" description="Teléfonos y correo para comunicarse y enviar comprobantes.">
            {/* Ejemplo ya funcionando: teléfono principal. Completar el resto. */}
            <FormField
                label="Teléfono principal"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="7120-4491"
                maxLength={CUSTOMER_LIMITS.PHONE_MAX}
                value={values.phone}
                onChange={handleChange}
                disabled={disabled}
                error={errors.phone}
            />

            <p className="rounded-md border border-dashed border-amber-300 bg-amber-50 p-3 text-xs text-amber-700 md:col-span-2">
                TODO Persona 2: teléfono secundario y correo.
            </p>
        </FormSection>
    );
}
