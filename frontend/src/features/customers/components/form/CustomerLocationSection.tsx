// src/features/customers/components/form/CustomerLocationSection.tsx
// 👤 DUEÑO: Persona 2
// Ubicación: departamento → municipio → distrito y dirección.
//   - Consumidor final: OPCIONAL (insignia "Opcional", sin asteriscos).
//   - Contribuyente: OBLIGATORIA (asterisco en los 3 selects y en la dirección).
//
// TODO (Persona 2):
//   [ ] Descripción según el tipo:
//         consumidor final → "Si eliges un departamento, completa también municipio y distrito."
//         contribuyente    → "Departamento, municipio y distrito del domicilio fiscal."
//   [ ] "Dirección exacta": <Label> + <Textarea name="address"> + <ErrorMessage>, maxLength CUSTOMER_LIMITS.ADDRESS_MAX.
//       Placeholder: "Colonia, calle, número de casa, punto de referencia..."
//   Referencia: sección "Ubicación" de SupplierForm.tsx
import { LocationSelect } from "../../../locations/components/LocationSelect";
import type { CustomerFormSectionProps } from "../../model/customers.types";
import { FormSection } from "./FormSection";

export function CustomerLocationSection({ idPrefix, values, errors, setField, disabled }: CustomerFormSectionProps) {
    const isTaxpayer = values.customer_type === "Taxpayer";

    return (
        <FormSection title="Ubicación" badge={isTaxpayer ? undefined : "Opcional"}>
            {/* Ya funcionando: los 3 selects en cascada. Falta la dirección y la descripción. */}
            <LocationSelect
                idPrefix={idPrefix}
                value={values.location}
                onChange={(location) => setField("location", location)}
                error={errors.location}
                disabled={disabled}
                required={isTaxpayer}
            />

            <p className="rounded-md border border-dashed border-amber-300 bg-amber-50 p-3 text-xs text-amber-700 md:col-span-3">
                TODO Persona 2: dirección exacta y descripción de la sección.
            </p>
        </FormSection>
    );
}
