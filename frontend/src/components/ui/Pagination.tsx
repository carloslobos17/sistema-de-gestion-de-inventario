// src/components/ui/Pagination.tsx
// Paginador compartido: "Mostrando 11–20 de 37" + Anterior / números / Siguiente.
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";
import type { PaginationProps } from "../../types/common";

// Páginas a mostrar: la primera, la última y las vecinas de la actual. "…" donde hay saltos.
// Ej. página 6 de 12 → [1, "…", 5, 6, 7, "…", 12]
function getPageItems(current: number, totalPages: number): (number | "…")[] {
    const pages = new Set([1, totalPages, current - 1, current, current + 1]);
    const sorted = [...pages].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);

    const items: (number | "…")[] = [];
    sorted.forEach((page, index) => {
        if (index > 0 && page - sorted[index - 1] > 1) items.push("…");
        items.push(page);
    });
    return items;
}

export function Pagination({ meta, onPageChange, isLoading = false, itemLabel = "registros" }: PaginationProps) {
    const { page, limit, total, totalPages } = meta;

    if (total === 0) return null;

    const from = (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    return (
        <nav
            aria-label="Paginación"
            className="flex flex-col items-center justify-between gap-3 sm:flex-row"
        >
            <p className="text-sm text-zinc-500">
                Mostrando <span className="font-semibold text-zinc-700">{from}–{to}</span> de{" "}
                <span className="font-semibold text-zinc-700">{total}</span> {itemLabel}
            </p>

            {totalPages > 1 && (
                <div className="flex items-center gap-1">
                    <Button
                        variant="secondary"
                        onClick={() => onPageChange(page - 1)}
                        disabled={page <= 1 || isLoading}
                        aria-label="Página anterior"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Anterior</span>
                    </Button>

                    {getPageItems(page, totalPages).map((item, index) =>
                        item === "…" ? (
                            <span key={`gap-${index}`} className="px-2 text-sm text-zinc-400">…</span>
                        ) : (
                            <button
                                key={item}
                                type="button"
                                onClick={() => onPageChange(item)}
                                disabled={isLoading}
                                aria-current={item === page ? "page" : undefined}
                                className={`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:pointer-events-none ${
                                    item === page
                                        ? "bg-slate-900 text-white"
                                        : "text-zinc-600 hover:bg-zinc-100"
                                }`}
                            >
                                {item}
                            </button>
                        )
                    )}

                    <Button
                        variant="secondary"
                        onClick={() => onPageChange(page + 1)}
                        disabled={page >= totalPages || isLoading}
                        aria-label="Página siguiente"
                    >
                        <span className="hidden sm:inline">Siguiente</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </nav>
    );
}
