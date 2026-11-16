// src/features/customers/components/form/CustomerLocationSection.tsx
// Ubicación: departamento → municipio → distrito y dirección.
//   - Consumidor final: OPCIONAL (insignia "Opcional", sin asteriscos).
//   - Contribuyente: OBLIGATORIA (asterisco en los 3 selects y en la dirección).
import { ErrorMessage } from "../../../../components/ui/ErrorMessage";
import { Label } from "../../../../components/ui/Label";
import { Textarea } from "../../../../components/ui/Textarea";
import { LocationSelect } from "../../../locations/components/LocationSelect";
import { CUSTOMER_LIMITS } from "../../model/customers.constants";
import type { CustomerFormSectionProps } from "../../model/customers.types";
import { FormSection } from "./FormSection";

export function CustomerLocationSection({ idPrefix, values, errors, setField, handleChange, disabled }: CustomerFormSectionProps) {
    const isTaxpayer = values.customer_type === "Taxpayer";
    const addressId = `${idPrefix}-address`;

    return (
        <FormSection
            title="Ubicación"
            badge={isTaxpayer ? undefined : "Opcional"}
            description={
                isTaxpayer
                    ? "Departamento, municipio y distrito del domicilio fiscal."
                    : "Si eliges un departamento, completa también municipio y distrito."
            }
        >
            <LocationSelect
                idPrefix={idPrefix}
                value={values.location}
                onChange={(location) => setField("location", location)}
                error={errors.location}
                disabled={disabled}
                required={isTaxpayer}
            />

            <div className="md:col-span-3">
                <Label htmlFor={addressId} required={isTaxpayer}>
                    Dirección exacta
                </Label>
                <Textarea
                    id={addressId}
                    name="address"
                    rows={2}
                    placeholder="Colonia, calle, número de casa, punto de referencia..."
                    maxLength={CUSTOMER_LIMITS.ADDRESS_MAX}
                    value={values.address}
                    onChange={handleChange}
                    disabled={disabled}
                    hasError={Boolean(errors.address)}
                    aria-describedby={errors.address ? `${addressId}-error` : undefined}
                />
                <ErrorMessage id={`${addressId}-error`} message={errors.address} />
            </div>
        </FormSection>
    );
}
