// src/components/ui/Textarea.tsx
// <textarea> con el mismo estilo que Input (direcciones, observaciones...).
import { forwardRef } from "react";
import type { TextareaProps } from "./ui.types";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ hasError = false, className = "", rows = 3, ...rest }, ref) => {
        return (
            <textarea
                ref={ref}
                rows={rows}
                className={`w-full resize-none rounded-md border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 transition-colors ${
                    hasError ? "border-red-400 focus:border-red-500 focus:ring-red-200" : "border-slate-300 focus:border-slate-500 focus:ring-slate-200"
                } ${className}`}
                aria-invalid={hasError}
                {...rest}
            />
        );
    }
);
Textarea.displayName = "Textarea";
