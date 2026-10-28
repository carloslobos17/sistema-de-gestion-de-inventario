// src/components/ui/ui.types.ts
// Props de los componentes de UI compartidos que no son de un módulo.
import type { SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    hasError?: boolean;
    placeholder?: string; // primera opción vacía, ej. "Seleccione..."
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    hasError?: boolean;
}
