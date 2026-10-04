import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";

import { cn } from "../../utils/cn";

const NavigationMenu = React.forwardRef<
    React.ComponentRef<typeof NavigationMenuPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
    <NavigationMenuPrimitive.Root
        ref={ref}
        className={cn("relative z-10 flex flex-1 items-center justify-center", className)}
        {...props}
    >
        {children}
        {/* Eliminamos el Viewport global para forzar la posición debajo de cada botón */}
    </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
    React.ComponentRef<typeof NavigationMenuPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
    <NavigationMenuPrimitive.List
        ref={ref}
        className={cn("group flex flex-1 list-none items-center justify-center gap-1", className)}
        {...props}
    />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

// 1. EL CAMBIO CLAVE: Hacemos que el Item sea 'relative'
const NavigationMenuItem = React.forwardRef<
    React.ComponentRef<typeof NavigationMenuPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
    <NavigationMenuPrimitive.Item ref={ref} className={cn("relative", className)} {...props} />
));
NavigationMenuItem.displayName = NavigationMenuPrimitive.Item.displayName;

const navigationMenuTriggerStyle = cva(
    "group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-active:bg-slate-100 data-active:text-slate-900 data-[state=open]:bg-slate-100"
);

const NavigationMenuTrigger = React.forwardRef<
    React.ComponentRef<typeof NavigationMenuPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <NavigationMenuPrimitive.Trigger
        ref={ref}
        className={cn(navigationMenuTriggerStyle(), "group", className)}
        {...props}
    >
        {children}
        <ChevronDown
            className="relative top-px ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
            aria-hidden="true"
        />
    </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

// 2. EL CAMBIO CLAVE: Posicionamos el contenido flotando justo debajo del Item
const NavigationMenuContent = React.forwardRef<
    React.ComponentRef<typeof NavigationMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
    <NavigationMenuPrimitive.Content
        ref={ref}
        className={cn(
            "absolute left-0 top-full mt-2 w-auto min-w-[200px] origin-top-left rounded-md border border-slate-200 bg-white p-2 text-slate-900 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            className
        )}
        {...props}
    />
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuIndicator = React.forwardRef<
    React.ComponentRef<typeof NavigationMenuPrimitive.Indicator>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
    <NavigationMenuPrimitive.Indicator
        ref={ref}
        className={cn("top-full z-1 flex h-1.5 items-end justify-center overflow-hidden", className)}
        {...props}
    >
        <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-slate-200 shadow-md" />
    </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;

export {
    navigationMenuTriggerStyle,
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuContent,
    NavigationMenuTrigger,
    NavigationMenuLink,
    NavigationMenuIndicator,
};