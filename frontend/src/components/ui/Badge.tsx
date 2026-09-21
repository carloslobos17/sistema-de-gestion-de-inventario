import type { ReactNode } from "react";

interface BadgeProps {
    children: ReactNode;
    variant?: "success" | "danger" | "neutral";
}

export function Badge({ children, variant = "neutral" }: BadgeProps) {
    const variants: Record<string, string> = {
        success: "bg-emerald-50 text-emerald-700 border-emerald-200",
        danger: "bg-rose-50 text-rose-700 border-rose-200",
        neutral: "bg-slate-100 text-slate-600 border-slate-200",
    };

    const dotColors: Record<string, string> = {
        success: "bg-emerald-500",
        danger: "bg-rose-500",
        neutral: "bg-slate-400",
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />
            {children}
        </span>
    );
}