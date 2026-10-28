// src/features/economic-activities/components/EconomicActivitySelect.tsx
// Selector con buscador para las 773 actividades de Hacienda. Busca por código o por nombre (sin importar tildes).
// Teclado: ↑ ↓ para moverse, Enter para elegir, Esc para cerrar.
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useEconomicActivities } from "../hooks/useEconomicActivities";
import type { EconomicActivitySelectProps } from "../model/economicActivities.types";

const MAX_RESULTS = 50; // no se dibujan las 773 a la vez

// "Ferretería" → "ferreteria" (para buscar sin importar mayúsculas ni tildes)
const normalize = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function EconomicActivitySelect({ id, value, onChange, hasError = false, disabled = false, describedBy }: EconomicActivitySelectProps) {
    const { activities, isLoading, error } = useEconomicActivities();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [highlighted, setHighlighted] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const selected = activities.find((activity) => activity.code === value);

    const results = useMemo(() => {
        const term = normalize(query.trim());
        const matches = term
            ? activities.filter((activity) => activity.code.startsWith(term) || normalize(activity.name).includes(term))
            : activities;
        return matches.slice(0, MAX_RESULTS);
    }, [activities, query]);

    // Cerrar al hacer clic fuera
    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const open = () => {
        setQuery("");
        setHighlighted(0);
        setIsOpen(true);
    };

    const choose = (code: string) => {
        onChange(code);
        setIsOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlighted((index) => Math.min(index + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlighted((index) => Math.max(index - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault(); // que no envíe el formulario
            if (results[highlighted]) choose(results[highlighted].code);
        } else if (e.key === "Escape") {
            setIsOpen(false);
        }
    };

    const listId = `${id}-options`;

    return (
        <div ref={containerRef} className="relative">
            <button
                id={id}
                type="button"
                onClick={() => (isOpen ? setIsOpen(false) : open())}
                disabled={disabled || isLoading}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-describedby={describedBy}
                aria-invalid={hasError || undefined}
                className={`flex w-full items-center justify-between gap-2 rounded-md border bg-white px-3 py-2 text-left text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 transition-colors ${
                    hasError ? "border-red-400 focus:border-red-500 focus:ring-red-200" : "border-slate-300 focus:border-slate-500 focus:ring-slate-200"
                }`}
            >
                <span className={`truncate ${selected ? "text-slate-900" : "text-slate-400"}`}>
                    {isLoading ? "Cargando..." : selected ? `${selected.code} · ${selected.name}` : error ?? "Seleccione..."}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
            </button>

            {isOpen && (
                <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
                    <div className="relative border-b border-zinc-100 p-2">
                        <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                        <input
                            autoFocus
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setHighlighted(0);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Buscar por código o nombre..."
                            aria-label="Buscar actividad económica"
                            aria-controls={listId}
                            className="w-full rounded-md border border-slate-300 py-2 pr-3 pl-8 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                        />
                    </div>

                    <ul id={listId} role="listbox" className="max-h-64 overflow-y-auto py-1">
                        {results.length === 0 ? (
                            <li className="px-3 py-2 text-sm text-zinc-500">No hay actividades que coincidan.</li>
                        ) : (
                            results.map((activity, index) => (
                                <li
                                    key={activity.code}
                                    role="option"
                                    aria-selected={activity.code === value}
                                    onMouseDown={(e) => e.preventDefault()} // que el input no pierda el foco antes del clic
                                    onClick={() => choose(activity.code)}
                                    onMouseEnter={() => setHighlighted(index)}
                                    className={`cursor-pointer px-3 py-2 text-sm ${
                                        index === highlighted ? "bg-zinc-100" : ""
                                    } ${activity.code === value ? "font-semibold text-zinc-900" : "text-zinc-700"}`}
                                >
                                    <span className="mr-2 font-mono text-xs text-zinc-500">{activity.code}</span>
                                    {activity.name}
                                </li>
                            ))
                        )}
                    </ul>

                    {results.length === MAX_RESULTS && (
                        <p className="border-t border-zinc-100 px-3 py-1.5 text-xs text-zinc-400">
                            Mostrando las primeras {MAX_RESULTS}. Escribe para afinar la búsqueda.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
