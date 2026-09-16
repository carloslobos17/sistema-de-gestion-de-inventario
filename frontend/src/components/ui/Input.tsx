import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ hasError = false, className = "", ...rest }, ref) => {
        return (
            <input
                ref={ref}
                className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 transition-colors ${
                    hasError ? "border-red-400 focus:border-red-500 focus:ring-red-200" : "border-slate-300 focus:border-slate-500 focus:ring-slate-200"
                } ${className}`}
                aria-invalid={hasError}
                {...rest}
            />
        );
    }
);
Input.displayName = "Input";