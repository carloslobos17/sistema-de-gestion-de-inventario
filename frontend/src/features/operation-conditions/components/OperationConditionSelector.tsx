// src/features/operation-conditions/components/OperationConditionSelector.tsx
// Selector reutilizable de condición de la operación (CAT-016): Contado / A crédito / Otro.
import { useMemo } from 'react';
import { OPERATION_CONDITION_OPTIONS } from '../model/operationConditions.constants';
import type { OperationCondition, OperationConditionSelectorProps } from '../model/operationConditions.types';

const NO_EXCLUSIONS: OperationCondition[] = []; // constante para no crear un arreglo nuevo en cada render

export function OperationConditionSelector({
    name,
    value,
    onChange,
    exclude = NO_EXCLUSIONS,
    disabled = false
}: OperationConditionSelectorProps) {
    const options = useMemo(
        () => OPERATION_CONDITION_OPTIONS.filter((option) => !exclude.includes(option.value)),
        [exclude]
    );

    return (
        <div role="radiogroup" className={`grid grid-cols-1 gap-3 ${options.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
            {options.map((option) => {
                const isSelected = value === option.value;
                return (
                    <label
                        key={option.value}
                        className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors ${isSelected ? 'border-slate-900 bg-slate-50' : 'border-zinc-200 hover:border-zinc-300'
                            } ${disabled ? 'pointer-events-none opacity-60' : ''}`}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={isSelected}
                            onChange={() => onChange(option.value)}
                            disabled={disabled}
                            className="mt-0.5 h-4 w-4 accent-slate-900"
                        />
                        <span>
                            <span className="block text-sm font-semibold text-slate-900">{option.label}</span>
                            <span className="block text-xs text-slate-500">{option.description}</span>
                        </span>
                    </label>
                );
            })}
        </div>
    );
}
