// src/features/customers/components/form/FormSection.tsx
// Contenedor de cada sección del formulario. En pantallas grandes: título y descripción a la IZQUIERDA
// y los campos a la DERECHA (aprovecha el ancho y reduce el scroll). En pantallas chicas: todo en una columna.
// Lo usan todas las secciones para que se vean iguales.
import type { ReactNode } from "react";

interface FormSectionProps {
    title: string;
    description?: string;
    badge?: string; // ej. "Opcional"
    columns?: 1 | 2 | 3; // columnas de campos en pantallas grandes
    children: ReactNode;
}

const GRID_COLUMNS: Record<1 | 2 | 3, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
};

export function FormSection({ title, description, badge, columns = 3, children }: FormSectionProps) {
    return (
        <section className="grid grid-cols-1 gap-4 px-6 py-6 md:px-8 lg:grid-cols-[14rem_1fr] lg:gap-8">
            {/* Título a la izquierda */}
            <div>
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
                    {badge && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">{badge}</span>
                    )}
                </div>
                {description && <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>}
            </div>

            {/* Campos a la derecha. Para que un campo ocupe más espacio: className="md:col-span-2" */}
            <div className={`grid gap-x-6 gap-y-5 ${GRID_COLUMNS[columns]}`}>{children}</div>
        </section>
    );
}
