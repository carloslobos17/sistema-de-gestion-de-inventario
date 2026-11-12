// src/features/customers/components/form/CustomerGeneralSection.tsx
// Datos generales: nombre / razón social, nombre comercial, documento y género.
import { ErrorMessage } from "../../../../components/ui/ErrorMessage";
import { FormField } from "../../../../components/ui/FormField";
import { Label } from "../../../../components/ui/Label";
import { Select } from "../../../../components/ui/Select";
import { DocumentFields } from "../../../fiscal/components/DocumentFields";
import { ALLOWED_DOCUMENT_TYPES, CUSTOMER_LIMITS, GENDER_OPTIONS } from "../../model/customers.constants";
import type { CustomerFormSectionProps } from "../../model/customers.types";
import { FormSection } from "./FormSection";

export function CustomerGeneralSection({ idPrefix, values, errors, setField, handleChange, disabled }: CustomerFormSectionProps) {
    const isTaxpayer = values.customer_type === "Taxpayer";
    const genderId = `${idPrefix}-gender`;

    return (
        <FormSection title="Datos generales" description="Identificación del cliente.">
            <div className={isTaxpayer ? "md:col-span-2" : "md:col-span-3"}>
                <FormField
                    label={isTaxpayer ? "Razón social" : "Nombre completo"}
                    name="name"
                    required
                    autoFocus
                    autoComplete={isTaxpayer ? "organization" : "name"}
                    placeholder={isTaxpayer ? "Ej. Ferretería El Sol, S.A. de C.V." : "Ej. Carlos Ernesto Benítez Morales"}
                    maxLength={CUSTOMER_LIMITS.NAME_MAX}
                    value={values.name}
                    onChange={handleChange}
                    disabled={disabled}
                    error={errors.name}
                />
            </div>

            {/* Nombre comercial: solo contribuyente (1 columna, junto a la razón social) */}
            {isTaxpayer && (
                <FormField
                    label="Nombre comercial"
                    name="trade_name"
                    placeholder="Ej. Ferretería El Sol"
                    maxLength={CUSTOMER_LIMITS.TRADE_NAME_MAX}
                    value={values.trade_name}
                    onChange={handleChange}
                    disabled={disabled}
                    error={errors.trade_name}
                />
            )}

            {/* Documento: obligatorio (NIT o DUI) en contribuyente; opcional en consumidor final */}
            <DocumentFields
                idPrefix={idPrefix}
                documentType={values.document_type}
                documentNumber={values.document_number}
                allowedTypes={ALLOWED_DOCUMENT_TYPES[values.customer_type]}
                onDocumentTypeChange={(type) => setField("document_type", type)}
                onDocumentNumberChange={(value) => setField("document_number", value)}
                typeError={errors.document_type}
                numberError={errors.document_number}
                disabled={disabled}
                required={isTaxpayer}
                emptyOptionLabel={isTaxpayer ? "Seleccione..." : "Sin documento"}
            />

            {/* Género (opcional, informativo) */}
            <div>
                <Label htmlFor={genderId}>Género</Label>
                <Select
                    id={genderId}
                    name="gender"
                    placeholder="Sin especificar"
                    value={values.gender}
                    onChange={handleChange}
                    disabled={disabled}
                    hasError={Boolean(errors.gender)}
                    aria-describedby={errors.gender ? `${genderId}-error` : undefined}
                >
                    {GENDER_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Select>
                <ErrorMessage id={`${genderId}-error`} message={errors.gender} />
            </div>
        </FormSection>
    );
}
