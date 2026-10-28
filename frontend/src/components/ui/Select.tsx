// src/components/ui/Select.tsx
// <select> con el mismo estilo que Input. Uso: <Select placeholder="Seleccione..." value=... onChange=...>{opciones}</Select>
import { forwardRef } from "react";
import type { SelectProps } from "./ui.types";

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ hasError = false, placeholder, className = "", children, ...rest }, ref) => {
        return (
            <select
                ref={ref}
                className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 transition-colors ${
                    hasError ? "border-red-400 focus:border-red-500 focus:ring-red-200" : "border-slate-300 focus:border-slate-500 focus:ring-slate-200"
                } ${className}`}
                aria-invalid={hasError}
                {...rest}
            >
                {placeholder !== undefined && <option value="">{placeholder}</option>}
                {children}
            </select>
        );
    }
);
Select.displayName = "Select";
