import { Lock } from "lucide-react";
import { ErrorMessage } from "../../../../components/ui/ErrorMessage";
import { formatCurrency } from "../../../../utils/formatCurrency";
import type { CustomerCreditSectionProps } from "../../model/customers.types";
import { FormSection } from "./FormSection";

export function CustomerCreditSection({
    value,
    onChange,
    error,
    canEdit,
}: CustomerCreditSectionProps) {
    const numericValue = Number(value);
    const hasCredit = Number.isFinite(numericValue) && numericValue > 0;
    const displayAmount = hasCredit ? formatCurrency(numericValue) : "Sin crédito";

    return (
        <FormSection
            title="Crédito comercial"
            description="Monto máximo que el cliente puede deber en ventas a crédito."
        >
            {canEdit ? (
                <div className="md:col-span-1">
                    <label
                        htmlFor="credit_limit"
                        className="mb-1.5 block text-sm font-medium text-zinc-700"
                    >
                        Límite de crédito
                    </label>

                    <div
                        className={`flex overflow-hidden rounded-lg border bg-white shadow-xs transition-colors focus-within:ring-2 ${
                            error
                                ? "border-rose-300 focus-within:border-rose-500 focus-within:ring-rose-500/20"
                                : "border-zinc-300 focus-within:border-blue-600 focus-within:ring-blue-600/20"
                        }`}
                    >
                        <span className="inline-flex select-none items-center border-r border-zinc-300 bg-zinc-100 px-3 text-sm font-medium text-zinc-500">
                            $
                        </span>
                        <input
                            id="credit_limit"
                            name="credit_limit"
                            type="text"
                            inputMode="decimal"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="0.00"
                            className="w-full min-w-0 border-0 bg-transparent px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
                        />
                    </div>

                    <ErrorMessage message={error} />

                    <p className="mt-2 flex items-center gap-1.5 whitespace-nowrap text-xs text-zinc-500">
                        <Lock className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                        <span>0 = sin crédito. Solo administradores pueden modificarlo.</span>
                    </p>
                </div>
            ) : (
                <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 md:col-span-2">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                        <Lock className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                        <span>Límite asignado</span>
                    </div>

                    <p className="mt-1.5 text-2xl font-bold tracking-tight text-zinc-900">
                        {displayAmount}
                    </p>

                    <p className="mt-1.5 text-xs text-zinc-500">
                        Solo un administrador puede cambiar el límite de crédito.
                    </p>
                </div>
            )}
        </FormSection>
    );
}