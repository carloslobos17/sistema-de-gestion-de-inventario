// src/components/ui/BackLink.tsx
// Enlace "Volver" con fondo redondeado y cambio de color al interactuar (flecha fija).
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BackLinkProps {
    to: string;
    label?: string;
    className?: string;
}

export function BackLink({ to, label = "Volver a la lista", className = "" }: BackLinkProps) {
    return (
        <Link
            to={to}
            className={`inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 ${className}`}
        >
            <ArrowLeft className="h-4 w-4 text-zinc-500" />
            <span>{label}</span>
        </Link>
    );
}