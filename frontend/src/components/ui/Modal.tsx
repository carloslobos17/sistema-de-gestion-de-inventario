// src/components/ui/Modal.tsx
// Modal genérico: fondo oscuro, cierre con Escape / clic afuera / botón X y bloqueo del scroll.
// El contenido (formulario, texto, etc.) va en children y los botones en footer.
//
// Uso:
//   <Modal isOpen={isOpen} title="Nueva marca" onClose={close} footer={<Button>Guardar</Button>}>
//       ...campos...
//   </Modal>
import { useEffect, useId, type ReactNode } from "react";
import { X } from "lucide-react";

export interface ModalProps {
    isOpen: boolean;
    title: string;
    description?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    // Mientras se guarda, el modal no se puede cerrar (evita perder la petición a medias)
    isBusy?: boolean;
    size?: "sm" | "md" | "lg";
    onClose: () => void;
}

const SIZE_CLASS = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
};

export function Modal({ isOpen, title, description, children, footer, isBusy = false, size = "md", onClose }: ModalProps) {
    const titleId = useId();

    // Cerrar con Escape
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !isBusy) onClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, isBusy, onClose]);

    // Bloquear el scroll del fondo mientras está abierto
    useEffect(() => {
        if (!isOpen) return;

        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Fondo */}
            <div className="fixed inset-0 bg-zinc-900/40" onClick={() => !isBusy && onClose()} />

            {/* Contenedor */}
            <div
                className={`relative flex w-full ${SIZE_CLASS[size]} flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl`}
            >
                {/* Encabezado */}
                <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-6 py-4">
                    <div className="space-y-1">
                        <h3 id={titleId} className="text-base font-bold text-zinc-900">
                            {title}
                        </h3>
                        {description && <div className="text-sm text-zinc-500">{description}</div>}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isBusy}
                        aria-label="Cerrar"
                        className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="px-6 py-5">{children}</div>

                {/* Pie con acciones */}
                {footer && (
                    <div className="flex items-center justify-end gap-3 border-t border-zinc-100 bg-zinc-50/50 px-6 py-4">{footer}</div>
                )}
            </div>
        </div>
    );
}
