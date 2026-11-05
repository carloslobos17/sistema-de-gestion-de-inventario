// src/features/customers/components/form/CustomerCreditSection.tsx
// 👤 DUEÑO: Persona 3
// Crédito comercial. Dos vistas según el permiso:
//   - canEdit = true (admin): campo "Límite de crédito" con "$" en una cajita gris a la izquierda, ancho corto,
//     y ayuda en UNA línea con candado: "0 = sin crédito. Solo administradores pueden modificarlo."
//   - canEdit = false (vendedor): tarjeta de SOLO LECTURA con candado, "Límite asignado" y el monto grande
//     ("$500.00" con formatCurrency de src/utils/formatCurrency.ts), y debajo
//     "Solo un administrador puede cambiar el límite de crédito." (si es 0 → "Sin crédito").
//
// TODO (Persona 3):
//   [ ] Vista editable (admin): input con inputMode="decimal", onChange(e.target.value), error con <ErrorMessage>.
//   [ ] Vista de solo lectura (vendedor) como en el diseño de Stitch.
//   [ ] El campo ocupa 1 columna (ancho corto); la tarjeta de solo lectura puede ocupar md:col-span-2.
//   ⚠️ El vendedor NUNCA envía credit_limit: eso ya lo controla el mapper (toCreate/UpdateCustomerPayload).
import type { CustomerCreditSectionProps } from "../../model/customers.types";
import { FormSection } from "./FormSection";

export function CustomerCreditSection({ value, canEdit }: CustomerCreditSectionProps) {
    return (
        <FormSection title="Crédito comercial" description="Monto máximo que el cliente puede deber en ventas a crédito.">
            <p className="rounded-md border border-dashed border-amber-300 bg-amber-50 p-3 text-xs text-amber-700 md:col-span-3">
                TODO Persona 3: {canEdit ? "campo editable" : "tarjeta de solo lectura"} (valor actual: ${value}).
            </p>
        </FormSection>
    );
}
