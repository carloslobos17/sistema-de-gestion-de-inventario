// src/components/layout/navigation.config.ts
// Estructura del mega menú. Para agregar una pantalla, solo se agrega un ítem aquí.
import {
    // Inventario
    Package, Layers, Handshake, AlertTriangle, ArrowRightLeft, List, ListTree, MapPin,
    // Compras
    Truck, Contact, Receipt, Users, FileText, FileMinus,
    // Ventas
    ShoppingCart, Store,
    // Financiero
    Monitor, Calculator, Landmark,
    // Sesión
    UserCircle, Lock, Clock, Power,
    // Configuraciones
    Settings, Building2, Network, Wand2, RefreshCw, HelpCircle, MessageSquare, FileCode2, Info,
} from "lucide-react";
import { ADMIN_ONLY } from "../../features/auth/auth.roles";
import type { NavGroup } from "./navigation.types";

export const NAV_GROUPS: NavGroup[] = [
    {
        label: "Inventario",
        items: [
            { label: "Gestión de Productos", description: "Productos con conteo de existencias", to: "/inventory/products", icon: Package },
            { label: "Productos No Inventariados", description: "Productos sin conteo de existencias", to: "/inventory/non-inventoried", icon: Layers },
            { label: "Gestión de Servicios", description: "Administre sus servicios", to: "/inventory/services", icon: Handshake },
            { label: "Unidades Mínimas", description: "Verifique productos agotados", to: "/inventory/low-stock", icon: AlertTriangle },
            { label: "Movimientos Internos", description: "Ingresos y egresos locales", to: "/inventory/movements", icon: ArrowRightLeft },
            { label: "Laboratorios", description: "Detalle de marcas de productos", to: "/inventory/brands", icon: List },
            { label: "Categorías", description: "Clasifique su inventario", to: "/categories", icon: List },
            { label: "Sub Categorías", description: "Sub clasifique su inventario", to: "/inventory/subcategories", icon: ListTree },
            { label: "Ubicaciones Físicas", description: "Organización física", to: "/inventory/locations", icon: MapPin },
        ],
    },
    {
        label: "Compras",
        items: [
            { label: "Gestión de Compras", description: "Archivo de compras a proveedores", to: "/purchases/orders", icon: Truck },
            { label: "Gestión de Proveedores", description: "Administre sus proveedores", to: "/suppliers", icon: Contact },
            { label: "Otros Cargos en Compras", description: "Impuestos y otros cargos", to: "/purchases/charges", icon: Receipt },
            { label: "Vendedores", description: "Vendedores de los proveedores", to: "/purchases/sellers", icon: Users },
            { label: "Líneas de Productos", description: "Líneas de los proveedores", to: "/purchases/lines", icon: List },
            { label: "Notas de Remisión", description: "Notas de remisión de compras", to: "/purchases/remissions", icon: FileText },
            { label: "Notas de Crédito/Débito", description: "Notas de crédito/débito de compras", to: "/purchases/credit-notes", icon: FileMinus },
        ],
    },
    {
        label: "Ventas",
        items: [
            { label: "Gestión de Ventas", description: "Ingreso de ventas a clientes", to: "/sales/orders", icon: ShoppingCart, colorClass: "bg-orange-400" },
            { label: "Cotizaciones", description: "Elaboración de cotizaciones", to: "/sales/quotes", icon: FileText },
            { label: "Gestión de Clientes", description: "Administre su cartera de clientes", to: "/customers", icon: Contact },
            { label: "Notas de Crédito", description: "Gestione sus notas de crédito", to: "/sales/credit-notes", icon: FileMinus },
            { label: "Lugares de Atención", description: "Puntos de atención a clientes", to: "/sales/locations", icon: Store },
        ],
    },
    {
        label: "Financiero",
        items: [
            { label: "Gestión de Cajas", description: "Caja chica y puntos de venta", to: "/finance/registers", icon: Monitor },
            { label: "Turnos y Cuadraturas", description: "Registro de turnos, cortes X y Z", to: "/finance/shifts", icon: Calculator },
            { label: "Bancos", description: "Archivo de bancos", to: "/finance/banks", icon: Landmark },
        ],
    },
    {
        label: "Reportes",
        items: [
            { label: "Reporte de Ventas", description: "Análisis mensual de ventas", to: "/reports/sales", icon: FileText },
            { label: "Reporte de Inventario", description: "Valorización de existencias", to: "/reports/inventory", icon: Package },
        ],
    },
    {
        label: "Sesión",
        items: [
            { label: "Mi Cuenta", description: "Administre su perfil de usuario", to: "/profile", icon: UserCircle },
            { label: "Gestión de Usuarios", description: "Administre usuarios y empleados", to: "/users", icon: Users, roles: ADMIN_ONLY },
            { label: "Control de Accesos", description: "Administre los accesos de usuarios", to: "/roles", icon: Lock, roles: ADMIN_ONLY },
            { label: "Bitácora de Usuarios", description: "Consulte el historial de actividades", to: "/audit-logs", icon: Clock, roles: ADMIN_ONLY },
            { label: "Cerrar Sesión", description: "Cierre sesión en el sistema", icon: Power, action: "logout" },
        ],
    },
    {
        label: "Configuraciones",
        items: [
            { label: "Entorno del Sistema", description: "Configuración global inicial", to: "/settings/environment", icon: Settings, roles: ADMIN_ONLY },
            { label: "Datos de la Empresa", description: "Ingreso de datos de la sucursal", to: "/settings/company", icon: Building2, roles: ADMIN_ONLY },
            { label: "Gestión de Sucursales", description: "Administre más sucursales", to: "/settings/branches", icon: Network, roles: ADMIN_ONLY },
            { label: "Activar Modo Claro", description: "Habilite la interfaz clara", to: "#", icon: Wand2 },
            { label: "Borrar Caché del Sistema", description: "Elimina datos temporales", to: "#", icon: RefreshCw },
            { label: "Ayuda", description: "Guías de ayuda del sistema", to: "/help", icon: HelpCircle },
            { label: "Chat con Asistente IA", description: "Pide ayuda al bot con IA", to: "/ai-chat", icon: MessageSquare },
            { label: "Consulta de DTE", description: "Consulte los DTE emitidos", to: "/settings/dte", icon: FileCode2 },
            { label: "Acerca del Sistema", description: "Detalles y actualizaciones", to: "/about", icon: Info },
        ],
    },
];
