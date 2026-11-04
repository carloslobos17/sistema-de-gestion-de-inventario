// src/features/operation-conditions/model/operationConditions.types.ts
// CAT-016 Condición de la operación (Hacienda). Mismos valores que el enum OperationCondition de Prisma.

export type OperationCondition = 'Cash' | 'Credit' | 'Other';

export interface OperationConditionOption {
    value: OperationCondition;
    label: string;
    description: string;
}

export interface OperationConditionSelectorProps {
    name: string; // nombre del grupo de radios (ej. "operation_condition")
    value: OperationCondition;
    onChange: (value: OperationCondition) => void;
    exclude?: OperationCondition[]; // ej. ["Other"] en el punto de venta
    disabled?: boolean;
}
