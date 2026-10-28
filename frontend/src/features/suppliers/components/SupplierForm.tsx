// src/features/suppliers/components/SupplierForm.tsx
// Formulario compartido por CreateSupplierPage y EditSupplierPage. Valida antes de enviar.
// Los campos cambian según el tipo: el contribuyente pide NRC y actividad económica; el sujeto excluido, no.
import { useId, type FormEvent } from "react";
import { Button } from "../../../components/ui/Button";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { FormField } from "../../../components/ui/FormField";
import { Label } from "../../../components/ui/Label";
import { Textarea } from "../../../components/ui/Textarea";
import { DocumentFields } from "../../fiscal/components/DocumentFields";
import { LocationSelect } from "../../locations/components/LocationSelect";
import { EconomicActivitySelect } from "../../economic-activities/components/EconomicActivitySelect";
import { useSupplierForm } from "../hooks/useSupplierForm";
import { ALLOWED_DOCUMENT_TYPES, SUPPLIER_LIMITS, SUPPLIER_TYPE_OPTIONS } from "../model/suppliers.constants";
import type { SupplierFormProps } from "../model/suppliers.types";

export function SupplierForm({ mode, initialValues, isSaving, onSubmit, onCancel }: SupplierFormProps) {
    const { values, errors, setField, handleChange, changeSupplierType, validate } = useSupplierForm(initialValues);
    const formId = useId();
    const isTaxpayer = values.supplier_type === "Taxpayer";

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isSaving) return;
        // Si no pasa la validación, los errores se muestran y NO se llama al backend
        if (!validate()) return;
        onSubmit(values);
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col">
            <div className="space-y-8 p-6 md:p-8">
                {/* Tipo de proveedor */}
                <fieldset>
                    <legend className="mb-3 text-sm font-semibold text-slate-900">Tipo de proveedor</legend>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {SUPPLIER_TYPE_OPTIONS.map((option) => {
                            const isSelected = values.supplier_type === option.value;
                            return (
                                <label
                                    key={option.value}
                                    className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors ${
                                        isSelected ? "border-slate-900 bg-slate-50" : "border-zinc-200 hover:border-zinc-300"
                                    } ${isSaving ? "pointer-events-none opacity-60" : ""}`}
                                >
                                    <input
                                        type="radio"
                                        name="supplier_type"
                                        value={option.value}
                                        checked={isSelected}
                                        onChange={() => changeSupplierType(option.value)}
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
                </fieldset>

                {/* Datos generales */}
                <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <h2 className="text-sm font-semibold text-slate-900 md:col-span-2">Datos generales</h2>

                    <div className={isTaxpayer ? "" : "md:col-span-2"}>
                        <FormField
                            label={isTaxpayer ? "Nombre comercial" : "Nombre"}
                            name="name"
                            required
                            autoFocus
                            autoComplete="organization"
                            placeholder={isTaxpayer ? "Ej. Distribuidora Vaz" : "Ej. Carlos Mario Urrutia"}
                            maxLength={SUPPLIER_LIMITS.NAME_MAX}
                            value={values.name}
                            onChange={handleChange}
                            disabled={isSaving}
                            error={errors.name}
                        />
                    </div>

                    {isTaxpayer && (
                        <FormField
                            label="Razón social"
                            name="legal_name"
                            placeholder="Ej. Distribuidora Vaz, S.A. de C.V."
                            maxLength={SUPPLIER_LIMITS.LEGAL_NAME_MAX}
                            value={values.legal_name}
                            onChange={handleChange}
                            disabled={isSaving}
                            error={errors.legal_name}
                        />
                    )}

                    <DocumentFields
                        idPrefix={formId}
                        documentType={values.document_type}
                        documentNumber={values.document_number}
                        allowedTypes={ALLOWED_DOCUMENT_TYPES[values.supplier_type]}
                        onDocumentTypeChange={(type) => setField("document_type", type)}
                        onDocumentNumberChange={(value) => setField("document_number", value)}
                        typeError={errors.document_type}
                        numberError={errors.document_number}
                        disabled={isSaving}
                    />
                </section>

                {/* Datos fiscales (solo contribuyentes) */}
                {isTaxpayer && (
                    <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <h2 className="text-sm font-semibold text-slate-900 md:col-span-2">Datos fiscales</h2>

                        <FormField
                            label="NRC"
                            name="nrc"
                            required
                            inputMode="numeric"
                            autoComplete="off"
                            placeholder="123456-7"
                            maxLength={10}
                            value={values.nrc}
                            onChange={handleChange}
                            disabled={isSaving}
                            error={errors.nrc}
                        />

                        <div>
                            <Label htmlFor="economic_activity_code" required>
                                Actividad económica
                            </Label>
                            <EconomicActivitySelect
                                id="economic_activity_code"
                                value={values.economic_activity_code}
                                onChange={(code) => setField("economic_activity_code", code)}
                                hasError={Boolean(errors.economic_activity_code)}
                                describedBy={errors.economic_activity_code ? "economic_activity_code-error" : undefined}
                                disabled={isSaving}
                            />
                            <ErrorMessage id="economic_activity_code-error" message={errors.economic_activity_code} />
                        </div>

                        <div className="md:col-span-2">
                            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 p-4">
                                <input
                                    type="checkbox"
                                    name="applies_perception"
                                    checked={values.applies_perception}
                                    onChange={handleChange}
                                    disabled={isSaving}
                                    className="mt-0.5 h-4 w-4 accent-slate-900"
                                />
                                <span>
                                    <span className="block text-sm font-semibold text-slate-900">Habilitar percepción</span>
                                    <span className="block text-xs text-slate-500">
                                        Márcalo si este proveedor es gran contribuyente y nos cobra percepción de IVA (1 %) en las compras.
                                    </span>
                                </span>
                            </label>
                        </div>
                    </section>
                )}

                {/* Ubicación */}
                <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <h2 className="text-sm font-semibold text-slate-900 md:col-span-3">Ubicación</h2>

                    <LocationSelect
                        idPrefix={formId}
                        value={values.location}
                        onChange={(location) => setField("location", location)}
                        error={errors.location}
                        disabled={isSaving}
                        required
                    />

                    <div className="md:col-span-3">
                        <Label htmlFor="address" required>
                            Dirección
                        </Label>
                        <Textarea
                            id="address"
                            name="address"
                            placeholder="Calle, colonia, número de local..."
                            maxLength={SUPPLIER_LIMITS.ADDRESS_MAX}
                            value={values.address}
                            onChange={handleChange}
                            disabled={isSaving}
                            hasError={Boolean(errors.address)}
                            aria-describedby={errors.address ? "address-error" : undefined}
                        />
                        <ErrorMessage id="address-error" message={errors.address} />
                    </div>
                </section>

                {/* Contacto */}
                <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <h2 className="text-sm font-semibold text-slate-900 md:col-span-2">Contacto</h2>

                    <FormField
                        label="Teléfono"
                        name="phone"
                        required={!isTaxpayer}
                        type="tel"
                        autoComplete="tel"
                        placeholder="2222-3333"
                        maxLength={SUPPLIER_LIMITS.PHONE_MAX}
                        value={values.phone}
                        onChange={handleChange}
                        disabled={isSaving}
                        error={errors.phone}
                    />

                    <FormField
                        label="Teléfono 2"
                        name="phone_alt"
                        type="tel"
                        placeholder="7777-7777"
                        maxLength={SUPPLIER_LIMITS.PHONE_MAX}
                        value={values.phone_alt}
                        onChange={handleChange}
                        disabled={isSaving}
                        error={errors.phone_alt}
                    />

                    <div className={isTaxpayer ? "" : "md:col-span-2"}>
                        <FormField
                            label="Correo electrónico"
                            name="email"
                            required
                            type="email"
                            autoComplete="email"
                            placeholder="ventas@empresa.com"
                            maxLength={SUPPLIER_LIMITS.EMAIL_MAX}
                            value={values.email}
                            onChange={handleChange}
                            disabled={isSaving}
                            error={errors.email}
                        />
                    </div>

                    {isTaxpayer && (
                        <FormField
                            label="Persona de contacto"
                            name="contact_name"
                            autoComplete="name"
                            placeholder="Ej. Carlos Pérez (vendedor)"
                            maxLength={SUPPLIER_LIMITS.CONTACT_NAME_MAX}
                            value={values.contact_name}
                            onChange={handleChange}
                            disabled={isSaving}
                            error={errors.contact_name}
                        />
                    )}
                </section>
            </div>

            {/* Pie */}
            <div className="flex items-center justify-end gap-3 border-t border-zinc-100 bg-zinc-50/50 p-6">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
                    Cancelar
                </Button>
                <Button type="submit" isLoading={isSaving}>
                    {mode === "edit" ? "Guardar cambios" : "Crear proveedor"}
                </Button>
            </div>
        </form>
    );
}
