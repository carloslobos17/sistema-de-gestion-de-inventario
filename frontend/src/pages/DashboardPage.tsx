// src/pages/DashboardPage.tsx
// Resumen rápido del negocio. TODO es MOCK por ahora: cuando exista el backend,
// los datos se mueven a features/dashboard (types, service, hooks) como en usuarios.
import { Link } from "react-router-dom";
import {
    AlertTriangle,
    ArrowDownRight,
    ArrowUpRight,
    DollarSign,
    FileText,
    Monitor,
    Receipt,
    ShoppingCart,
    type LucideIcon,
} from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";

// ==========================================
// TIPOS (mock)
// ==========================================

interface Kpi {
    label: string;
    value: string;
    change?: number; // % contra el periodo anterior
    hint: string;
    icon: LucideIcon;
    iconClass: string;
    to?: string;
}

interface DailySale {
    day: string;
    total: number;
}

interface LowStockProduct {
    name: string;
    stock: number;
    min: number;
    unit: string;
}

interface RecentSale {
    id: string;
    customer: string;
    total: number;
    method: "Efectivo" | "Tarjeta" | "Transferencia" | "Crédito";
    time: string;
}

interface TopProduct {
    name: string;
    units: number;
    total: number;
}

// ==========================================
// DATOS MOCK
// ==========================================

const KPIS: Kpi[] = [
    { label: "Ventas de hoy", value: "$2,845.50", change: 12.4, hint: "vs. ayer", icon: DollarSign, iconClass: "bg-emerald-500", to: "/sales/orders" },
    { label: "Ventas del mes", value: "$58,320.75", change: -3.1, hint: "vs. mes anterior", icon: ShoppingCart, iconClass: "bg-blue-500", to: "/reports/sales" },
    { label: "Transacciones hoy", value: "47", change: 8.0, hint: "ticket promedio $60.54", icon: Receipt, iconClass: "bg-violet-500" },
    { label: "Productos bajo mínimo", value: "14", hint: "requieren reabastecimiento", icon: AlertTriangle, iconClass: "bg-amber-500", to: "/inventory/low-stock" },
];

const WEEKLY_SALES: DailySale[] = [
    { day: "Lun", total: 2150 },
    { day: "Mar", total: 1890 },
    { day: "Mié", total: 2640 },
    { day: "Jue", total: 3120 },
    { day: "Vie", total: 3580 },
    { day: "Sáb", total: 4210 },
    { day: "Hoy", total: 2845.5 },
];

const LOW_STOCK: LowStockProduct[] = [
    { name: "Cemento gris 42.5 kg", stock: 8, min: 50, unit: "bolsas" },
    { name: "Varilla corrugada 3/8\"", stock: 25, min: 100, unit: "unid." },
    { name: "Block de concreto 15x20x40", stock: 120, min: 500, unit: "unid." },
    { name: "Tubo PVC 1/2\" 6 m", stock: 6, min: 30, unit: "unid." },
    { name: "Pintura látex blanca 1 gal", stock: 4, min: 20, unit: "galones" },
];

const RECENT_SALES: RecentSale[] = [
    { id: "V-001284", customer: "Constructora El Roble", total: 1240.0, method: "Crédito", time: "14:32" },
    { id: "V-001283", customer: "Cliente general", total: 38.75, method: "Efectivo", time: "14:10" },
    { id: "V-001282", customer: "José Hernández", total: 215.4, method: "Tarjeta", time: "13:48" },
    { id: "V-001281", customer: "Ferretería La Esquina", total: 560.0, method: "Transferencia", time: "13:05" },
    { id: "V-001280", customer: "Cliente general", total: 12.5, method: "Efectivo", time: "12:51" },
];

const TOP_PRODUCTS: TopProduct[] = [
    { name: "Cemento gris 42.5 kg", units: 312, total: 3432.0 },
    { name: "Arena de río (m³)", units: 85, total: 2125.0 },
    { name: "Varilla corrugada 3/8\"", units: 640, total: 1856.0 },
    { name: "Clavo de 3\" (lb)", units: 420, total: 546.0 },
];

const CASH_REGISTER = {
    name: "Caja 1 - Principal",
    cashier: "Carlos Martínez",
    openedAt: "07:30",
    openingAmount: 100,
    cashSales: 1185.25,
    cardSales: 960.25,
    transferSales: 700,
};

// ==========================================
// HELPERS
// ==========================================

const currency = new Intl.NumberFormat("es-SV", { style: "currency", currency: "USD" });
const formatMoney = (value: number) => currency.format(value);

const METHOD_STYLES: Record<RecentSale["method"], string> = {
    Efectivo: "bg-emerald-50 text-emerald-700",
    Tarjeta: "bg-blue-50 text-blue-700",
    Transferencia: "bg-violet-50 text-violet-700",
    Crédito: "bg-amber-50 text-amber-700",
};

const CARD = "rounded-xl border border-slate-200 bg-white shadow-sm";

// ==========================================
// PÁGINA
// ==========================================

export function DashboardPage() {
    const maxDaily = Math.max(...WEEKLY_SALES.map((d) => d.total));
    const weekTotal = WEEKLY_SALES.reduce((sum, d) => sum + d.total, 0);
    const expectedCash = CASH_REGISTER.openingAmount + CASH_REGISTER.cashSales;

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <PageHeader
                title="Panel de Control"
                description="Resumen rápido de ventas, inventario y caja del día."
                action={
                    <Link
                        to="/sales/orders"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 sm:w-auto"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Nueva Venta
                    </Link>
                }
            />

            {/* KPIs */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {KPIS.map((kpi) => {
                    const content = (
                        <div className={`${CARD} flex h-full items-start gap-4 p-5 transition-shadow hover:shadow-md`}>
                            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white ${kpi.iconClass}`}>
                                <kpi.icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
                                <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{kpi.value}</p>
                                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                    {kpi.change !== undefined && (
                                        <span
                                            className={`inline-flex items-center font-semibold ${kpi.change >= 0 ? "text-emerald-600" : "text-rose-600"
                                                }`}
                                        >
                                            {kpi.change >= 0 ? (
                                                <ArrowUpRight className="h-3.5 w-3.5" />
                                            ) : (
                                                <ArrowDownRight className="h-3.5 w-3.5" />
                                            )}
                                            {Math.abs(kpi.change)}%
                                        </span>
                                    )}
                                    {kpi.hint}
                                </p>
                            </div>
                        </div>
                    );

                    return kpi.to ? (
                        <Link key={kpi.label} to={kpi.to} className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
                            {content}
                        </Link>
                    ) : (
                        <div key={kpi.label}>{content}</div>
                    );
                })}
            </section>

            {/* Ventas de la semana + Caja */}
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className={`${CARD} p-5 lg:col-span-2`}>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">Ventas de los últimos 7 días</h2>
                            <p className="mt-0.5 text-sm text-slate-500">Total de la semana: {formatMoney(weekTotal)}</p>
                        </div>
                        <Link to="/reports/sales" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                            Ver reporte
                        </Link>
                    </div>

                    {/* Gráfico de barras simple (sin librerías) */}
                    <div className="mt-6 flex h-56 items-end gap-3" role="img" aria-label="Gráfico de ventas de los últimos 7 días">
                        {WEEKLY_SALES.map((d, i) => {
                            const isToday = i === WEEKLY_SALES.length - 1;
                            return (
                                <div key={d.day} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
                                    <span className="text-xs font-semibold text-slate-700 opacity-0 transition-opacity group-hover:opacity-100">
                                        {formatMoney(d.total)}
                                    </span>
                                    <div
                                        className={`w-full max-w-14 rounded-t-md transition-colors ${isToday ? "bg-blue-500" : "bg-slate-200 group-hover:bg-slate-300"
                                            }`}
                                        style={{ height: `${(d.total / maxDaily) * 100}%` }}
                                        title={`${d.day}: ${formatMoney(d.total)}`}
                                    />
                                    <span className={`text-xs ${isToday ? "font-semibold text-slate-900" : "text-slate-500"}`}>{d.day}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className={`${CARD} flex flex-col p-5`}>
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-900">Estado de caja</h2>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Turno abierto
                        </span>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                            <Monitor className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">{CASH_REGISTER.name}</p>
                            <p className="text-xs text-slate-500">
                                {CASH_REGISTER.cashier} · desde las {CASH_REGISTER.openedAt}
                            </p>
                        </div>
                    </div>

                    <dl className="mt-5 space-y-2.5 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Monto de apertura</dt>
                            <dd className="font-medium text-slate-900">{formatMoney(CASH_REGISTER.openingAmount)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Ventas en efectivo</dt>
                            <dd className="font-medium text-slate-900">{formatMoney(CASH_REGISTER.cashSales)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Ventas con tarjeta</dt>
                            <dd className="font-medium text-slate-900">{formatMoney(CASH_REGISTER.cardSales)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Transferencias</dt>
                            <dd className="font-medium text-slate-900">{formatMoney(CASH_REGISTER.transferSales)}</dd>
                        </div>
                        <div className="flex justify-between border-t border-slate-100 pt-2.5">
                            <dt className="font-semibold text-slate-900">Efectivo esperado</dt>
                            <dd className="font-bold text-slate-900">{formatMoney(expectedCash)}</dd>
                        </div>
                    </dl>

                    <Link
                        to="/finance/shifts"
                        className="mt-auto pt-5 text-center text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        Ir a turnos y cuadraturas
                    </Link>
                </div>
            </section>

            {/* Stock bajo + Últimas ventas + Más vendidos */}
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Stock bajo */}
                <div className={CARD}>
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            Stock bajo
                        </h2>
                        <Link to="/inventory/low-stock" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                            Ver todo
                        </Link>
                    </div>
                    <ul className="divide-y divide-slate-100">
                        {LOW_STOCK.map((p) => {
                            const percent = Math.min(100, (p.stock / p.min) * 100);
                            return (
                                <li key={p.name} className="px-5 py-3">
                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <span className="truncate font-medium text-slate-800">{p.name}</span>
                                        <span className="shrink-0 text-xs text-slate-500">
                                            <span className="font-semibold text-rose-600">{p.stock}</span> / {p.min} {p.unit}
                                        </span>
                                    </div>
                                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className={`h-full rounded-full ${percent < 25 ? "bg-rose-500" : "bg-amber-400"}`}
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Últimas ventas */}
                <div className={CARD}>
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                            <FileText className="h-4 w-4 text-slate-400" />
                            Últimas ventas
                        </h2>
                        <Link to="/sales/orders" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                            Ver todo
                        </Link>
                    </div>
                    <ul className="divide-y divide-slate-100">
                        {RECENT_SALES.map((s) => (
                            <li key={s.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                                <div className="min-w-0">
                                    <p className="truncate font-medium text-slate-800">{s.customer}</p>
                                    <p className="text-xs text-slate-500">
                                        {s.id} · {s.time}
                                    </p>
                                </div>
                                <div className="shrink-0 text-right">
                                    <p className="font-semibold text-slate-900">{formatMoney(s.total)}</p>
                                    <span className={`mt-0.5 inline-block rounded px-1.5 py-0.5 text-[11px] font-medium ${METHOD_STYLES[s.method]}`}>
                                        {s.method}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Más vendidos */}
                <div className={CARD}>
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                            <ShoppingCart className="h-4 w-4 text-slate-400" />
                            Más vendidos del mes
                        </h2>
                    </div>
                    <ol className="divide-y divide-slate-100">
                        {TOP_PRODUCTS.map((p, i) => (
                            <li key={p.name} className="flex items-center gap-3 px-5 py-3 text-sm">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                                    {i + 1}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium text-slate-800">{p.name}</p>
                                    <p className="text-xs text-slate-500">{p.units} unidades</p>
                                </div>
                                <span className="shrink-0 font-semibold text-slate-900">{formatMoney(p.total)}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>
        </div>
    );
}
