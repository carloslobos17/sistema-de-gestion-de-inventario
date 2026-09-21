import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../features/auth/hooks/useCurrentUser";

export function Navbar() {
    const navigate = useNavigate();
    const usuario = useCurrentUser();

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        navigate("/login");
    }

    const nombreCompleto = usuario ? `${usuario.nombre} ${usuario.apellido}` : "";
    const iniciales = usuario ? `${usuario.nombre[0]}${usuario.apellido[0]}`.toUpperCase() : "";

    return (
        <header className="bg-slate-900 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo con enlace al inicio */}
                    <div className="flex items-center gap-8">
                        <Link to="/usuarios" className="flex items-center gap-2">
                            <span className="font-bold text-lg tracking-tight text-white">
                                Sistema de Gestion <span className="text-xs uppercase px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-normal">ERP</span>
                            </span>
                        </Link>

                        {/* Enlaces con estado activo automático */}
                        <nav className="hidden md:flex items-center gap-2 text-sm">
                            <NavLink
                                to="/inventario"
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-md transition-colors ${
                                        isActive ? "text-white bg-slate-800 font-medium" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                    }`
                                }
                            >
                                Inventario
                            </NavLink>

                            <NavLink
                                to="/compras"
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-md transition-colors ${
                                        isActive ? "text-white bg-slate-800 font-medium" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                    }`
                                }
                            >
                                Compras
                            </NavLink>

                            <NavLink
                                to="/ventas"
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-md transition-colors ${
                                        isActive ? "text-white bg-slate-800 font-medium" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                    }`
                                }
                            >
                                Ventas
                            </NavLink>

                            <NavLink
                                to="/usuarios"
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-md transition-colors ${
                                        isActive ? "text-white bg-slate-800 font-medium" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                    }`
                                }
                            >
                                Usuarios
                            </NavLink>
                        </nav>
                    </div>

                    {/* Perfil del Usuario y Cierre de Sesión */}
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-white leading-none">{nombreCompleto}</p>
                            <p className="text-xs text-slate-400 mt-1">{usuario?.rol}</p>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-sm font-semibold text-slate-200">
                            {iniciales}
                        </div>
                        <button
                            onClick={handleLogout}
                            title="Cerrar Sesión"
                            className="text-xs text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/50 px-2.5 py-1 rounded transition-colors"
                        >
                            Salir
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}