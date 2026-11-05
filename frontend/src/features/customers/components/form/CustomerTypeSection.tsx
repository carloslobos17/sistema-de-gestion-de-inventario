// src/features/customers/components/form/CustomerTypeSection.tsx
// 👤 DUEÑO: Persona 2
// Tarjetas "Consumidor final" / "Contribuyente" (radio). Al cambiar, el formulario muestra u oculta campos.
//
// TODO (Persona 2):
//   [ ] Dar el estilo del diseño de Stitch: dos tarjetas lado a lado, la elegida con borde oscuro y fondo gris claro.
//   [ ] Sin insignias tipo "Seleccionado"/"Activo": solo el borde y el radio marcado.
//   [ ] Deshabilitar (opacity-60, sin clics) mientras se guarda (prop disabled).
//   Referencia: el fieldset "Tipo de proveedor" de src/features/suppliers/components/SupplierForm.tsx
import { CUSTOMER_TYPE_OPTIONS } from "../../model/customers.constants";
import type { CustomerTypeSectionProps } from "../../model/customers.types";
import { FormSection } from "./FormSection";

export function CustomerTypeSection({ value, onChange, disabled }: CustomerTypeSectionProps) {
    return (
        <FormSection title="Tipo de cliente" description="Define qué datos se piden y qué comprobante se le emite." columns={2}>
            {/* Versión mínima para poder probar el cambio de tipo. Reemplazar por las tarjetas del diseño. */}
            {CUSTOMER_TYPE_OPTIONS.map((option) => (
                <label key={option.value} className="flex items-center gap-2 text-sm">
                    <input
                        type="radio"
                        name="customer_type"
                        value={option.value}
                        checked={value === option.value}
                        onChange={() => onChange(option.value)}
                        disabled={disabled}
                    />
                    {option.label}
                </label>
            ))}
        </FormSection>
    );
}
