// src/features/customers/model/customers.validator.ts
// 👤 DUEÑO: Persona 1
// Reglas del formulario de cliente. DEBEN ser iguales a las del backend (backend/src/modules/customers/customer.schema.ts).
// Devuelve TODOS los errores a la vez: { campo: "mensaje" }. Objeto vacío = formulario válido.
//
// TODO (Persona 1): implementar estas reglas
//   AMBOS TIPOS
//   [ ] name: obligatorio, entre CUSTOMER_LIMITS.NAME_MIN y NAME_MAX caracteres.
//   [ ] phone / phone_alt: opcionales; si traen algo, solo números, espacios, +, - y paréntesis (máx. PHONE_MAX).
//   [ ] credit_limit: número >= 0, máximo 2 decimales y <= CREDIT_LIMIT_MAX.
//   [ ] Documento a medias: si hay document_type debe haber número (y al revés).
//       Si hay ambos → getDocumentNumberError(tipo, número) de fiscal.utils.
//   [ ] Ubicación "todo o nada": si eligió departamento o municipio pero NO distrito →
//       errors.location = "Completa el municipio y el distrito".
//   CONSUMIDOR FINAL
//   [ ] email opcional; si trae algo, formato válido.
//   CONTRIBUYENTE
//   [ ] document_type obligatorio y SOLO NIT o DUI (ALLOWED_DOCUMENT_TYPES.Taxpayer).
//   [ ] nrc obligatorio (isValidNrc de fiscal.utils).
//   [ ] economic_activity_code obligatorio.
//   [ ] Ubicación completa obligatoria (district_id) y address obligatoria.
//   [ ] email obligatorio y con formato válido.
//   Referencia: src/features/suppliers/model/suppliers.validator.ts (mismo estilo: Zod + reglas por tipo)
import { CUSTOMER_LIMITS } from './customers.constants';
import type { CustomerFormErrors, CustomerFormValues } from './customers.types';

export function validateCustomerForm(values: CustomerFormValues): CustomerFormErrors {
    const errors: CustomerFormErrors = {};

    // Regla mínima de ejemplo (ya funcionando). Agregar el resto de reglas de la lista de arriba.
    const name = values.name.trim();
    if (name.length < CUSTOMER_LIMITS.NAME_MIN) {
        errors.name = name ? `El nombre debe tener al menos ${CUSTOMER_LIMITS.NAME_MIN} caracteres` : 'El nombre es obligatorio';
    }

    return errors;
}
