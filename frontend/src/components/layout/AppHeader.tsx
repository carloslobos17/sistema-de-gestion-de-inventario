// src/components/layout/AppHeader.tsx
import { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Power, Settings, UserCircle } from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useCurrentUser } from "../../features/auth/hooks/useCurrentUser";
import { ADMIN_ONLY, hasAnyRole } from "../../features/auth/auth.roles";
import { MegaMenuItem } from "./MegaMenuItem";
import { NAV_GROUPS } from "./navigation.config";
import { filterNavGroupsByRole } from "./navigation.utils";

export function AppHeader() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const currentUser = useCurrentUser();

    const fullName = currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : "";
    const role = currentUser?.role ?? "";
    const initials = (currentUser?.first_name?.[0] ?? "").toUpperCase();
    const roleId = currentUser?.role_id;

    // Solo los menús y opciones que este rol puede abrir
    const navGroups = useMemo(() => filterNavGroupsByRole(NAV_GROUPS, roleId), [roleId]);
    const isAdmin = hasAnyRole(roleId, ADMIN_ONLY);

    function handleLogout() {
        localStorage.clear();
        navigate("/login");
    }

    return (
        <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-sm">
            <div className="flex h-14 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                {/* LOGO */}
                <Link to="/dashboard" className="flex shrink-0 items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                        CM
                    </span>
                    <span className="hidden text-sm font-bold tracking-tight text-slate-900 xl:block">
                        Constru-Martínez
                    </span>
                </Link>

                {/* MEGA MENÚ (desde lg; en pantallas menores no cabe) */}
                <NavigationMenu className="hidden lg:flex">
                    <NavigationMenuList>
                        {/* Dashboard: enlace directo, sin desplegable */}
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild active={pathname === "/dashboard"}>
                                <Link to="/dashboard" className={navigationMenuTriggerStyle()}>
                                    Dashboard
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        {navGroups.map((group) => (
                            <NavigationMenuItem key={group.label}>
                                <NavigationMenuTrigger>{group.label}</NavigationMenuTrigger>

                                <NavigationMenuContent>
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 px-4 py-5 sm:px-6 lg:grid-cols-3 lg:px-8 xl:grid-cols-4">
                                        {group.items.map((item) => (
                                            <MegaMenuItem
                                                key={item.label}
                                                item={item}
                                                isActive={pathname === item.to}
                                                onLogout={handleLogout}
                                            />
                                        ))}
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>

                {/* MENÚ DE USUARIO (DERECHA) */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="flex shrink-0 items-center gap-2 rounded-full py-1 pr-2 pl-1 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                                {initials}
                            </span>
                            <span className="hidden text-left xl:block">
                                <span className="block text-sm leading-none font-bold text-slate-900">{fullName}</span>
                                <span className="mt-1 block text-xs font-medium text-slate-500">{role}</span>
                            </span>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => navigate("/profile")}>
                            <UserCircle /> Perfil
                        </DropdownMenuItem>
                        {isAdmin && (
                            <DropdownMenuItem onSelect={() => navigate("/users")}>
                                <Settings /> Configuración
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onSelect={handleLogout}
                            className="text-rose-600 focus:bg-rose-50 focus:text-rose-700"
                        >
                            <Power /> Cerrar sesión
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
