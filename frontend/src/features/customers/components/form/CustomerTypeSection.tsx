// src/features/customers/components/form/CustomerTypeSection.tsx
// Tarjetas "Consumidor final" / "Contribuyente" (radio). Al cambiar, el formulario muestra u oculta campos.
import { CUSTOMER_TYPE_OPTIONS } from "../../model/customers.constants";
import type { CustomerTypeSectionProps } from "../../model/customers.types";
import { FormSection } from "./FormSection";

export function CustomerTypeSection({ value, onChange, disabled }: CustomerTypeSectionProps) {
    return (
        <FormSection title="Tipo de cliente" description="Define qué datos se piden y qué comprobante se le emite." columns={2}>
            {CUSTOMER_TYPE_OPTIONS.map((option) => {
                const isSelected = value === option.value;
                return (
                    <label
                        key={option.value}
                        className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors ${
                            isSelected ? "border-slate-900 bg-slate-50" : "border-zinc-200 hover:border-zinc-300"
                        } ${disabled ? "pointer-events-none opacity-60" : ""}`}
                    >
                        <input
                            type="radio"
                            name="customer_type"
                            value={option.value}
                            checked={isSelected}
                            onChange={() => onChange(option.value)}
                            disabled={disabled}
                            className="mt-0.5 h-4 w-4 accent-slate-900"
                        />
                        <span>
                            <span className="block text-sm font-semibold text-slate-900">{option.label}</span>
                            <span className="block text-xs text-slate-500">{option.description}</span>
                        </span>
                    </label>
                );
            })}
        </FormSection>
    );
}
