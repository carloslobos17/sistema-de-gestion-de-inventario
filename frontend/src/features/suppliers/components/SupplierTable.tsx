// src/features/suppliers/components/SupplierTable.tsx
// Tabla de proveedores. Con permiso, cada fila tiene "Editar" (va a la página de edición) y SupplierStatusButton.
import { Link } from "react-router-dom";
import { Badge } from "../../../components/ui/Badge";
import { SupplierStatusButton } from "./SupplierStatusButton";
import { DOCUMENT_TYPE_LABELS } from "../../fiscal/model/fiscal.constants";
import { formatDocumentNumber, formatNrc } from "../../fiscal/model/fiscal.utils";
import { SUPPLIER_TYPE_LABELS } from "../model/suppliers.constants";
import type { SupplierTableProps } from "../model/suppliers.types";

export function SupplierTable({ suppliers, canManage, onSupplierStatusChanged }: SupplierTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
                        <tr>
                            <th scope="col" className="px-6 py-3">Proveedor</th>
                            <th scope="col" className="px-6 py-3">Tipo</th>
                            <th scope="col" className="px-6 py-3">Documento</th>
                            <th scope="col" className="px-6 py-3">NRC</th>
                            <th scope="col" className="px-6 py-3">Ubicación</th>
                            <th scope="col" className="px-6 py-3">Estado</th>
                            {canManage && <th scope="col" className="px-6 py-3 text-right">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {suppliers.map((supplier) => (
                            <tr key={supplier.id} className="transition-colors hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <p className="font-medium text-slate-900">{supplier.name}</p>
                                    {supplier.legal_name && <p className="text-xs text-slate-500">{supplier.legal_name}</p>}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-slate-700">
                                    {SUPPLIER_TYPE_LABELS[supplier.supplier_type]}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-slate-700">
                                    <span className="text-xs text-slate-500">{DOCUMENT_TYPE_LABELS[supplier.document_type]} </span>
                                    {formatDocumentNumber(supplier.document_type, supplier.document_number)}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-slate-700">{formatNrc(supplier.nrc) || "—"}</td>
                                <td className="px-6 py-4 text-slate-700">{supplier.location_label}</td>
                                <td className="px-6 py-4">
                                    <Badge variant={supplier.is_active ? "success" : "danger"}>
                                        {supplier.is_active ? "Activo" : "Inactivo"}
                                    </Badge>
                                </td>
                                {canManage && (
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-1">
                                            <Link
                                                to={`/suppliers/${supplier.id}/edit`}
                                                className="rounded px-2 py-1 font-medium text-blue-600 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                            >
                                                Editar
                                            </Link>
                                            <SupplierStatusButton supplier={supplier} onChanged={onSupplierStatusChanged} />
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
