// src/features/fiscal/components/DocumentFields.tsx
// Tipo de documento + número, en dos columnas. Solo dibuja: el formulario guarda los valores.
// required=false y emptyOptionLabel="Sin documento" → documento opcional (consumidor final).
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Select } from "../../../components/ui/Select";
import { DOCUMENT_NUMBER_PLACEHOLDERS, DOCUMENT_TYPE_LABELS } from "../model/fiscal.constants";
import type { DocumentFieldsProps, DocumentType } from "../model/fiscal.types";

export function DocumentFields({
    idPrefix,
    documentType,
    documentNumber,
    allowedTypes,
    onDocumentTypeChange,
    onDocumentNumberChange,
    typeError,
    numberError,
    disabled = false,
    required = true,
    emptyOptionLabel = "Seleccione...",
}: DocumentFieldsProps) {
    const typeId = `${idPrefix}-document_type`;
    const numberId = `${idPrefix}-document_number`;

    return (
        <>
            <div>
                <Label htmlFor={typeId} required={required}>
                    Tipo de identificación
                </Label>
                <Select
                    id={typeId}
                    placeholder={emptyOptionLabel}
                    value={documentType}
                    onChange={(e) => onDocumentTypeChange(e.target.value as DocumentType | "")}
                    disabled={disabled}
                    hasError={Boolean(typeError)}
                    aria-describedby={typeError ? `${typeId}-error` : undefined}
                >
                    {allowedTypes.map((type) => (
                        <option key={type} value={type}>
                            {DOCUMENT_TYPE_LABELS[type]}
                        </option>
                    ))}
                </Select>
                <ErrorMessage id={`${typeId}-error`} message={typeError} />
            </div>

            <div>
                <Label htmlFor={numberId} required={required}>
                    Número de documento
                </Label>
                <Input
                    id={numberId}
                    autoComplete="off"
                    maxLength={25}
                    placeholder={documentType ? DOCUMENT_NUMBER_PLACEHOLDERS[documentType] : "Elija primero el tipo"}
                    value={documentNumber}
                    onChange={(e) => onDocumentNumberChange(e.target.value)}
                    disabled={disabled || !documentType}
                    hasError={Boolean(numberError)}
                    aria-describedby={numberError ? `${numberId}-error` : undefined}
                />
                <ErrorMessage id={`${numberId}-error`} message={numberError} />
            </div>
        </>
    );
}
