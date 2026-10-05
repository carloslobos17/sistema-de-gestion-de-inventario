// src/features/users/components/UserTable.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../../components/ui/Badge";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";
import { formatDate } from "../../../utils/formatDate";
import type { UserItem } from "../model/users.types";
import { ROLE_LABELS } from "../model/users.constants";

export interface UserTableProps {
    users: UserItem[];
    onToggleStatus?: (user: UserItem) => Promise<unknown> | void;
    isProcessing?: boolean;
}

export function UserTable({ users, onToggleStatus, isProcessing = false }: UserTableProps) {
    const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

    const handleConfirm = async () => {
        if (!selectedUser || !onToggleStatus) return;
        await onToggleStatus(selectedUser);
        setSelectedUser(null);
    };

    return (
        <>
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
                            <tr>
                                <th scope="col" className="px-6 py-3">Usuario</th>
                                <th scope="col" className="px-6 py-3">Nombre completo</th>
                                <th scope="col" className="px-6 py-3">Rol</th>
                                <th scope="col" className="px-6 py-3">Estado</th>
                                <th scope="col" className="px-6 py-3">Registro</th>
                                <th scope="col" className="px-6 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((u) => (
                                <tr key={u.id} className="transition-colors hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">@{u.username}</td>
                                    <td className="px-6 py-4 text-slate-700">
                                        {u.first_name} {u.last_name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                                            {ROLE_LABELS[u.role_id] || u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={u.is_active ? "success" : "danger"}>
                                            {u.is_active ? "Activo" : "Inactivo"}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{formatDate(u.created_at)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-1">
                                            <Link
                                                to={`/users/${u.id}/edit`}
                                                className="rounded px-2 py-1 font-medium text-blue-600 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedUser(u)}
                                                className={`rounded px-2 py-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 ${u.is_active
                                                    ? "text-rose-600 hover:bg-rose-50 focus-visible:ring-rose-500"
                                                    : "text-emerald-600 hover:bg-emerald-50 focus-visible:ring-emerald-500"
                                                    }`}
                                            >
                                                {u.is_active ? "Desactivar" : "Activar"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmModal
                isOpen={Boolean(selectedUser)}
                onClose={() => setSelectedUser(null)}
                onConfirm={handleConfirm}
                isLoading={isProcessing}
                variant={selectedUser?.is_active ? "danger" : "primary"}
                title={selectedUser?.is_active ? "Desactivar Usuario" : "Reactivar Usuario"}
                description={
                    selectedUser?.is_active ? (
                        <>
                            ¿Estás seguro de que deseas desactivar a <strong>@{selectedUser?.username}</strong>? Se
                            cerrarán sus sesiones activas y no podrá acceder al sistema.
                        </>
                    ) : (
                        <>
                            ¿Deseas reactivar la cuenta de <strong>@{selectedUser?.username}</strong>? El usuario
                            podrá volver a iniciar sesión de inmediato.
                        </>
                    )
                }
                confirmText={selectedUser?.is_active ? "Sí, desactivar" : "Sí, reactivar"}
            />
        </>
    );
}