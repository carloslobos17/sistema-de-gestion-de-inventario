import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "secondary";
    isLoading?: boolean;
}

export function Button({ children, variant = "primary", isLoading = false, disabled, className = "", ...rest }: ButtonProps) {
    const base = "inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";
    const variants: Record<string, string> = {
        primary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-500",
        secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-300",
    };

    return (
        <button className={`${base} ${variants[variant]} ${className}`} disabled={disabled || isLoading} {...rest}>
            {isLoading && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
            )}
            {children}
        </button>
    );
}