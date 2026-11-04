// src/features/operation-conditions/model/operationConditions.constants.ts
// Opciones fijas de CAT-016. Son 3 y no cambian: viven aquí, sin pedirlas al backend.
import type { OperationConditionOption } from './operationConditions.types';

export const OPERATION_CONDITION_OPTIONS: readonly OperationConditionOption[] = [
    { value: 'Cash', label: 'Contado', description: 'Se paga completo en el momento.' },
    { value: 'Credit', label: 'A crédito', description: 'Se paga después; queda una cuenta pendiente.' },
    { value: 'Other', label: 'Otro', description: 'Otra condición acordada (poco común).' }
];
