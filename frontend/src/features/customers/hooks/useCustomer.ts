// src/features/customers/hooks/useCustomer.ts
// 👤 DUEÑO: Persona 3
// Carga un solo cliente por ID (para precargar el formulario de edición).
//
// TODO (Persona 3):
//   [ ] Validar el id (entero > 0); si no → error "El ID del cliente no es válido."
//   [ ] customersApi.fetchCustomerById(id) en un useEffect, con bandera "cancelled" para ignorar respuestas viejas.
//   [ ] Devolver { customer, isLoading, error } (404 → "Cliente no encontrado" viene del backend).
//   Referencia: src/features/suppliers/hooks/useSupplier.ts
import type { Customer } from '../model/customers.types';

export function useCustomer(id: number) {
    const customer: Customer | null = null;
    const isLoading = false;
    const error: string | null = `Pendiente: cargar el cliente ${id} (useCustomer)`;

    return { customer, isLoading, error };
}
