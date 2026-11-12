// src/features/customers/components/form/CustomerFiscalSection.tsx
// Datos fiscales (SOLO contribuyente; CustomerForm ya la oculta para consumidor final): NRC y actividad económica.
import { ErrorMessage } from "../../../../components/ui/ErrorMessage";
import { FormField } from "../../../../components/ui/FormField";
import { Label } from "../../../../components/ui/Label";
import { EconomicActivitySelect } from "../../../economic-activities/components/EconomicActivitySelect";
import type { CustomerFormSectionProps } from "../../model/customers.types";
import { FormSection } from "./FormSection";

export function CustomerFiscalSection({ idPrefix, values, errors, setField, handleChange, disabled }: CustomerFormSectionProps) {
    const activityId = `${idPrefix}-economic_activity_code`;
    const activityErrorId = `${activityId}-error`;

    return (
        <FormSection title="Datos fiscales" description="Datos de inscripción en IVA ante el Ministerio de Hacienda.">
            <FormField
                label="NRC"
                name="nrc"
                required
                inputMode="numeric"
                autoComplete="off"
                placeholder="123456-7"
                maxLength={10}
                value={values.nrc}
                onChange={handleChange}
                disabled={disabled}
                error={errors.nrc}
            />

            <div className="md:col-span-2">
                <Label htmlFor={activityId} required>
                    Actividad económica
                </Label>
                <EconomicActivitySelect
                    id={activityId}
                    value={values.economic_activity_code}
                    onChange={(code) => setField("economic_activity_code", code)}
                    hasError={Boolean(errors.economic_activity_code)}
                    describedBy={errors.economic_activity_code ? activityErrorId : undefined}
                    disabled={disabled}
                />
                <ErrorMessage id={activityErrorId} message={errors.economic_activity_code} />
            </div>
        </FormSection>
    );
}
