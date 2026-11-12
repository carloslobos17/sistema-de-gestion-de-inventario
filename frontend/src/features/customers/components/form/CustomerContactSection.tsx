// src/features/customers/components/form/CustomerContactSection.tsx
// Contacto: teléfono principal, teléfono secundario y correo.
//   - Teléfonos: SIEMPRE opcionales (sin asterisco, sin prefijo "+503").
//   - Correo: opcional en consumidor final, OBLIGATORIO en contribuyente.
import { ErrorMessage } from "../../../../components/ui/ErrorMessage";
import { FormField } from "../../../../components/ui/FormField";
import { Input } from "../../../../components/ui/Input";
import { Label } from "../../../../components/ui/Label";
import { CUSTOMER_LIMITS } from "../../model/customers.constants";
import type { CustomerFormSectionProps } from "../../model/customers.types";
import { FormSection } from "./FormSection";

export function CustomerContactSection({ idPrefix, values, errors, handleChange, disabled }: CustomerFormSectionProps) {
    const isTaxpayer = values.customer_type === "Taxpayer";
    const emailId = `${idPrefix}-email`;
    const emailErrorId = `${emailId}-error`;
    const emailHelpId = `${emailId}-help`;

    return (
        <FormSection title="Contacto" description="Teléfonos y correo para comunicarse y enviar comprobantes.">
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

            <FormField
                label="Teléfono secundario"
                name="phone_alt"
                type="tel"
                autoComplete="off"
                placeholder="2289-4500"
                maxLength={CUSTOMER_LIMITS.PHONE_MAX}
                value={values.phone_alt}
                onChange={handleChange}
                disabled={disabled}
                error={errors.phone_alt}
            />

            <div>
                <Label htmlFor={emailId} required={isTaxpayer}>
                    Correo electrónico
                </Label>
                <Input
                    id={emailId}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="cliente@ejemplo.com"
                    maxLength={CUSTOMER_LIMITS.EMAIL_MAX}
                    value={values.email}
                    onChange={handleChange}
                    disabled={disabled}
                    hasError={Boolean(errors.email)}
                    aria-describedby={errors.email ? emailErrorId : emailHelpId}
                />
                <ErrorMessage id={emailErrorId} message={errors.email} />
                {!errors.email && (
                    <p id={emailHelpId} className="mt-1.5 text-xs text-slate-500">
                        {isTaxpayer
                            ? "Aquí se enviará el comprobante electrónico (DTE)."
                            : "Opcional. Si lo tiene, se le puede enviar la factura electrónica (DTE)."}
                    </p>
                )}
            </div>
        </FormSection>
    );
}
