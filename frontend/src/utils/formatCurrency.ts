// src/utils/formatCurrency.ts
// Formato de dinero en dólares para mostrar en pantalla: 1250.5 → "$1,250.50".
// Compartido: lo usarán también productos, compras y ventas.
const usdFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function formatCurrency(amount: number): string {
    return usdFormatter.format(amount);
}
