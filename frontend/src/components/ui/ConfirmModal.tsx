// src/components/ui/ConfirmModal.tsx
import { useEffect, type ReactNode } from "react";
import { AlertTriangle, Info, X } from "lucide-react";
import { Button } from "./Button";

export interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    description: ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "primary";
    isLoading?: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

const VARIANT_CONFIG = {
    danger: {
        icon: AlertTriangle,
        iconBg: "bg-rose-100 text-rose-600",
        btnVariant: "danger" as const,
    },
    warning: {
        icon: AlertTriangle,
        iconBg: "bg-amber-100 text-amber-600",
        btnVariant: "primary" as const,
    },
    primary: {
        icon: Info,
        iconBg: "bg-blue-100 text-blue-600",
        btnVariant: "primary" as const,
    },
};

export function ConfirmModal({
    isOpen,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = "danger",
    isLoading = false,
    onConfirm,
    onClose,
}: ConfirmModalProps) {
    // Cerrar con la tecla Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen && !isLoading) {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, isLoading, onClose]);

    // Bloquear el scroll del fondo cuando el modal esté abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const config = VARIANT_CONFIG[variant];
    const IconComponent = config.icon;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
        >
            {/* Fondo oscuro con desenfoque */}
            <div
                className="fixed inset-0 bg-zinc-900/40 transition-opacity"
                onClick={() => !isLoading && onClose()}
            />

            {/* Contenedor del Modal */}
            <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl transition-all sm:my-8">
                {/* Botón cerrar esquina superior */}
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    aria-label="Cerrar modal"
                    className="absolute top-4 right-4 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 disabled:opacity-50"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="flex items-start gap-4">
                    {/* Icono con fondo de color según la variante */}
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${config.iconBg}`}>
                        <IconComponent className="h-6 w-6" />
                    </div>

                    {/* Contenido textual */}
                    <div className="space-y-1.5 pt-1">
                        <h3 id="confirm-modal-title" className="text-base font-bold text-zinc-900">
                            {title}
                        </h3>
                        <div className="text-sm leading-relaxed text-zinc-500">
                            {description}
                        </div>
                    </div>
                </div>

                {/* Acciones reutilizando <Button /> */}
                <div className="mt-6 flex items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={isLoading}
                        className="h-10 px-4"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        variant={config.btnVariant}
                        onClick={onConfirm}
                        isLoading={isLoading}
                        className="h-10 min-w-[6rem]"
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}