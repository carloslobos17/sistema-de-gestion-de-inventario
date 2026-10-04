import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Boxes,
    ChevronDown,
    LayoutDashboard,
    LogOut,
    Settings,
    ShoppingBag,
    ShoppingCart,
    User as UserIcon,
    type LucideIcon,
} from "lucide-react";

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
import { cn } from "../../utils/cn";
import { useCurrentUser } from "../../features/auth/hooks/useCurrentUser";

interface NavLinkItem {
    label: string;
    description: string;
    to: string;
}

interface NavGroup {
    label: string;
    icon: LucideIcon;
    items: NavLinkItem[];
}

const DASHBOARD_LINK = { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard };

const NAV_GROUPS: NavGroup[] = [
    {
        label: "Inventario",
        icon: Boxes,
        items: [
            { label: "Categorías", description: "Clasifica los productos del inventario.", to: "/categories" },
            { label: "Marcas", description: "Administra las marcas de los productos.", to: "/brands" },
            { label: "Unidades", description: "Unidades de medida y presentación.", to: "/units" },
        ],
    },
    {
        label: "Compras",
        icon: ShoppingBag,
        items: [
            { label: "Proveedores", description: "Directorio de proveedores.", to: "/suppliers" },
            { label: "Órdenes", description: "Órdenes de compra y recepciones.", to: "/purchase-orders" },
        ],
    },
    {
        label: "Ventas",
        icon: ShoppingCart,
        items: [
            { label: "Clientes", description: "Cartera de clientes.", to: "/customers" },
            { label: "Facturación", description: "Emisión y consulta de facturas.", to: "/invoicing" },
            { label: "Caja", description: "Apertura, cierre y movimientos de caja.", to: "/cash-register" },
        ],
    },
    {
        label: "Configuración",
        icon: Settings,
        items: [
            { label: "Usuarios", description: "Cuentas de empleados y accesos.", to: "/users" },
            { label: "Roles", description: "Roles y permisos del sistema.", to: "/roles" },
        ],
    },
];

export function AppHeader() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const currentUser = useCurrentUser();

    // Datos reales del usuario guardados tras el login
    const user = {
        fullName: currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : "",
        role: currentUser?.role ?? "",
    };
    const initials = (currentUser?.first_name?.[0] ?? "").toUpperCase();

    function handleLogout() {
        localStorage.clear();
        navigate("/login");
    }

    return (
        <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-sm">
            <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-6">
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                            CM
                        </span>
                        <span className="hidden text-sm font-semibold tracking-tight text-slate-900 sm:block">
                            Constru-Martínez
                        </span>
                    </Link>

                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild active={pathname === DASHBOARD_LINK.to}>
                                    <Link to={DASHBOARD_LINK.to} className={navigationMenuTriggerStyle()}>
                                        <DASHBOARD_LINK.icon className="mr-2 h-4 w-4" />
                                        {DASHBOARD_LINK.label}
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            {NAV_GROUPS.map((group) => (
                                <NavigationMenuItem key={group.label}>
                                    <NavigationMenuTrigger>
                                        <group.icon className="mr-2 h-4 w-4" />
                                        {group.label}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-72 gap-1 p-2">
                                            {group.items.map((item) => (
                                                <li key={item.to}>
                                                    <NavigationMenuLink asChild active={pathname === item.to}>
                                                        <Link
                                                            to={item.to}
                                                            className={cn(
                                                                "block select-none rounded-md px-3 py-2 transition-colors hover:bg-slate-100 focus:bg-slate-100",
                                                                pathname === item.to && "bg-slate-100"
                                                            )}
                                                        >
                                                            <div className="text-sm font-medium text-slate-900">
                                                                {item.label}
                                                            </div>
                                                            <p className="mt-0.5 text-xs leading-snug text-slate-500">
                                                                {item.description}
                                                            </p>
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                                {initials}
                            </span>
                            <span className="hidden text-left sm:block">
                                <span className="block text-sm font-medium leading-none text-slate-900">
                                    {user.fullName}
                                </span>
                                <span className="mt-1 block text-xs leading-none text-slate-500">{user.role}</span>
                            </span>
                            <ChevronDown className="h-4 w-4 text-slate-500" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <UserIcon />
                            Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => navigate("/users")}>
                            <Settings />
                            Configuración
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onSelect={handleLogout}
                            className="text-rose-600 focus:bg-rose-50 focus:text-rose-700"
                        >
                            <LogOut />
                            Cerrar sesión
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
