import { Badge } from "../../../components/ui/Badge";
import { formatDate } from "../../../utils/formatDate";
import type { UsuarioItem } from "../usuarios.types";

interface UserTableProps {
    usuarios: UsuarioItem[];
}

export function UserTable({ usuarios }: UserTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
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
                    {usuarios.map((u) => (
                        <tr key={u.id} className="transition-colors hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900">
                                @{u.nombre_usuario}
                            </td>
                            <td className="px-6 py-4 text-slate-700">
                                {u.nombre} {u.apellido}
                            </td>
                            <td className="px-6 py-4">
                                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                                        {u.rol}
                                    </span>
                            </td>
                            <td className="px-6 py-4">
                                <Badge variant={u.activo ? "success" : "danger"}>
                                    {u.activo ? "Activo" : "Inactivo"}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 text-slate-500">{formatDate(u.fecha_creacion)}</td>
                            <td className="px-6 py-4">
                                <div className="flex justify-end gap-1">
                                    <button className="rounded px-2 py-1 font-medium text-blue-600 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                                        Editar
                                    </button>
                                    <button className="rounded px-2 py-1 font-medium text-rose-600 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500">
                                        {u.activo ? "Desactivar" : "Activar"}
                                    </button>
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