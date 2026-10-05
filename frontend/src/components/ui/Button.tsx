// src/components/ui/Button.tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "danger";
    isLoading?: boolean;
}

export function Button({ children, variant = "primary", isLoading = false, disabled, className = "", ...rest }: ButtonProps) {
    const base = "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:pointer-events-none";

    const variants: Record<string, string> = {
        primary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900 shadow-sm",
        secondary: "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50 focus:ring-zinc-200 shadow-sm font-medium",
        danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-sm",
    };

    return (
        <button className={`${base} ${variants[variant]} ${className}`} disabled={disabled || isLoading} {...rest}>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
}