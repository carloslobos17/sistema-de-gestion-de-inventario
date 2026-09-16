import type { LabelHTMLAttributes, ReactNode } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    children: ReactNode;
    required?: boolean;
}

export function Label({ children, required, className = "", ...rest }: LabelProps) {
    return (
        <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${className}`} {...rest}>
            {children}
            {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
    );
}