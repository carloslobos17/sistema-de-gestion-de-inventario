import { Link } from "react-router-dom";
import { NavigationMenuLink } from "../ui/navigation-menu";
import { cn } from "../../utils/cn";
import type { MegaMenuItemProps } from "./navigation.types";

const DEFAULT_ICON_BG = "bg-[#3B82F6]";

export function MegaMenuItem({ item, isActive, onLogout }: MegaMenuItemProps) {
    const isLogout = item.action === "logout";

    const content = (
        <div
            className={cn(
                "flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-slate-50",
                isActive && "bg-slate-50"
            )}
        >
            <div
                className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm",
                    item.colorClass ?? DEFAULT_ICON_BG
                )}
            >
                <item.icon className="h-5 w-5" />
            </div>
            <div className="flex min-w-0 flex-col pt-0.5">
                <span className={cn("text-sm font-bold text-slate-800", isLogout && "text-rose-600")}>{item.label}</span>
                <span className="mt-0.5 line-clamp-1 text-xs text-slate-500">{item.description}</span>
            </div>
        </div>
    );

    // NavigationMenuLink también en el botón: así cierra el menú al hacer clic y funciona con teclado
    return (
        <NavigationMenuLink asChild active={isActive}>
            {isLogout ? (
                <button type="button" onClick={onLogout} className="w-full rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
                    {content}
                </button>
            ) : (
                <Link to={item.to ?? "#"} className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
                    {content}
                </Link>
            )}
        </NavigationMenuLink>
    );
}