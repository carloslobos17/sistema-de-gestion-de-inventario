// src/features/customers/components/CustomerTable.tsx
// Tabla de clientes. "Editar" lo ven todos (el vendedor también edita datos).
// "Desactivar / Reactivar" solo con permiso (canManage).
import { Link } from "react-router-dom";
import { Badge } from "../../../components/ui/Badge";
import { formatCurrency } from "../../../utils/formatCurrency";
import { DOCUMENT_TYPE_LABELS } from "../../fiscal/model/fiscal.constants";
import { formatDocumentNumber, formatNrc } from "../../fiscal/model/fiscal.utils";
import { CustomerStatusButton } from "./CustomerStatusButton";
import { CUSTOMER_TYPE_BADGE_CLASSES, CUSTOMER_TYPE_LABELS } from "../model/customers.constants";
import type { CustomerTableProps } from "../model/customers.types";

const EMPTY = <span className="text-slate-400">—</span>;

export function CustomerTable({ customers, canManage, onCustomerStatusChanged }: CustomerTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
                        <tr>
                            <th scope="col" className="px-6 py-3">Cliente</th>
                            <th scope="col" className="px-6 py-3">Tipo</th>
                            <th scope="col" className="px-6 py-3">Documento</th>
                            <th scope="col" className="px-6 py-3">NRC</th>
                            <th scope="col" className="px-6 py-3">Teléfono</th>
                            <th scope="col" className="px-6 py-3">Ubicación</th>
                            <th scope="col" className="px-6 py-3 text-right">Límite de crédito</th>
                            <th scope="col" className="px-6 py-3">Estado</th>
                            <th scope="col" className="px-6 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {customers.map((customer) => (
                            <tr key={customer.id} className="transition-colors hover:bg-slate-50">
                                {/* Cliente + nombre comercial */}
                                <td className="px-6 py-4">
                                    <p className="font-medium text-slate-900">{customer.name}</p>
                                    {customer.trade_name && <p className="text-xs text-slate-500">{customer.trade_name}</p>}
                                </td>

                                {/* Tipo */}
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span
                                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${CUSTOMER_TYPE_BADGE_CLASSES[customer.customer_type]}`}
                                    >
                                        {CUSTOMER_TYPE_LABELS[customer.customer_type]}
                                    </span>
                                </td>

                                {/* Documento (opcional en consumidor final) */}
                                <td className="whitespace-nowrap px-6 py-4 text-slate-700">
                                    {customer.document_type && customer.document_number ? (
                                        <>
                                            <span className="text-xs text-slate-500">{DOCUMENT_TYPE_LABELS[customer.document_type]} </span>
                                            {formatDocumentNumber(customer.document_type, customer.document_number)}
                                        </>
                                    ) : (
                                        EMPTY
                                    )}
                                </td>

                                {/* NRC (solo contribuyente) */}
                                <td className="whitespace-nowrap px-6 py-4 text-slate-700">{formatNrc(customer.nrc) || EMPTY}</td>

                                {/* Teléfono tal como se guardó (sin prefijo) */}
                                <td className="whitespace-nowrap px-6 py-4 text-slate-700">{customer.phone || EMPTY}</td>

                                {/* Ubicación (truncada; el texto completo aparece al pasar el mouse) */}
                                <td className="max-w-[14rem] px-6 py-4 text-slate-500">
                                    {customer.location_label ? (
                                        <span className="block truncate" title={customer.location_label}>
                                            {customer.location_label}
                                        </span>
                                    ) : (
                                        EMPTY
                                    )}
                                </td>

                                {/* Límite de crédito */}
                                <td className="whitespace-nowrap px-6 py-4 text-right">
                                    {customer.credit_limit > 0 ? (
                                        <span className="font-medium text-slate-900">{formatCurrency(customer.credit_limit)}</span>
                                    ) : (
                                        <span className="text-slate-400">Sin crédito</span>
                                    )}
                                </td>

                                {/* Estado */}
                                <td className="px-6 py-4">
                                    <Badge variant={customer.is_active ? "success" : "danger"}>
                                        {customer.is_active ? "Activo" : "Inactivo"}
                                    </Badge>
                                </td>

                                {/* Acciones */}
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-1">
                                        <Link
                                            to={`/customers/${customer.id}/edit`}
                                            className="rounded px-2 py-1 font-medium text-blue-600 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                        >
                                            Editar
                                        </Link>
                                        {canManage && <CustomerStatusButton customer={customer} onChanged={onCustomerStatusChanged} />}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
