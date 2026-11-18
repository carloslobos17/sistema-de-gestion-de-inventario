// src/features/fiscal/components/DocumentFields.tsx
// Tipo de documento + número, en dos columnas. Solo dibuja: el formulario guarda los valores.
// required=false y emptyOptionLabel="Sin documento" → documento opcional (consumidor final).
// DUI y NIT llevan máscara: los guiones se ponen solos (ver fiscal.mask.ts). Los demás tipos se escriben libres.
import { useLayoutEffect, useRef, type ChangeEvent } from "react";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Select } from "../../../components/ui/Select";
import { DOCUMENT_NUMBER_MAX_LENGTH, DOCUMENT_NUMBER_PLACEHOLDERS, DOCUMENT_TYPE_LABELS } from "../model/fiscal.constants";
import { applyMaskedEdit, formatDocumentOnBlur, formatDocumentWhileTyping, isMaskedDocumentType } from "../model/fiscal.mask";
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
    const isMasked = isMaskedDocumentType(documentType);

    // Con máscara, el texto se reescribe en cada tecla: hay que devolver el cursor a su lugar
    const numberInputRef = useRef<HTMLInputElement>(null);
    const pendingCaretRef = useRef<number | null>(null);

    useLayoutEffect(() => {
        const caret = pendingCaretRef.current;
        if (caret === null || !numberInputRef.current) return;
        pendingCaretRef.current = null;
        if (document.activeElement === numberInputRef.current) {
            numberInputRef.current.setSelectionRange(caret, caret);
        }
    }, [documentNumber]);

    // Al cambiar el tipo, lo ya escrito se adapta: DUI/NIT → solo dígitos con su máscara; otros → recortado a su largo
    const handleTypeChange = (nextType: DocumentType | "") => {
        onDocumentTypeChange(nextType);
        if (!nextType || !documentNumber) return;

        const adjusted = isMaskedDocumentType(nextType)
            ? formatDocumentOnBlur(nextType, formatDocumentWhileTyping(nextType, documentNumber.replace(/\D/g, "")))
            : documentNumber.slice(0, DOCUMENT_NUMBER_MAX_LENGTH[nextType]);

        if (adjusted !== documentNumber) onDocumentNumberChange(adjusted);
    };

    const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!isMasked) {
            onDocumentNumberChange(e.target.value);
            return;
        }

        const { value, caret } = applyMaskedEdit({
            type: documentType,
            previous: documentNumber,
            raw: e.target.value,
            caret: e.target.selectionStart ?? e.target.value.length,
            inputType: (e.nativeEvent as InputEvent).inputType,
        });

        pendingCaretRef.current = caret;
        onDocumentNumberChange(value);
    };

    // Al salir del campo: quita el guion final suelto y pasa el NIT de 9 dígitos al formato del DUI
    const handleNumberBlur = () => {
        if (!isMasked || !documentNumber) return;
        const formatted = formatDocumentOnBlur(documentType, documentNumber);
        if (formatted !== documentNumber) onDocumentNumberChange(formatted);
    };

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
                    onChange={(e) => handleTypeChange(e.target.value as DocumentType | "")}
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
                    ref={numberInputRef}
                    id={numberId}
                    autoComplete="off"
                    inputMode={isMasked ? "numeric" : undefined}
                    // Con máscara el límite lo pone la cantidad de dígitos (así no se corta lo que se pega con espacios)
                    maxLength={documentType && !isMasked ? DOCUMENT_NUMBER_MAX_LENGTH[documentType] : undefined}
                    placeholder={documentType ? DOCUMENT_NUMBER_PLACEHOLDERS[documentType] : "Elija primero el tipo"}
                    value={documentNumber}
                    onChange={handleNumberChange}
                    onBlur={handleNumberBlur}
                    disabled={disabled || !documentType}
                    hasError={Boolean(numberError)}
                    aria-describedby={numberError ? `${numberId}-error` : undefined}
                />
                <ErrorMessage id={`${numberId}-error`} message={numberError} />
            </div>
        </>
    );
}
