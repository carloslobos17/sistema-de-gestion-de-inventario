import { useId, type FormEvent } from "react";
import { toast } from "sonner";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { useBrandForm } from "../hooks/useBrandForm";
import { useCreateBrand } from "../hooks/useCreateBrand";
import { useUpdateBrand } from "../hooks/useUpdateBrand";
import { EMPTY_BRAND_FORM } from "../model/brands.constants";
import { toBrandFormValues } from "../model/brands.mappers";
import type { BrandFormModalProps, BrandFormValues } from "../model/brands.types";

export function BrandFormModal({ isOpen, mode, brand, onClose, onSuccess }: BrandFormModalProps) {
    const isEdit = mode === "edit";
    const { createBrand, isSaving: isCreating } = useCreateBrand();
    const { updateBrand, isSaving: isUpdating } = useUpdateBrand();
    const isSaving = isCreating || isUpdating;

    const handleSubmit = async (values: BrandFormValues) => {
        if (isSaving) return;

        if (isEdit && !brand) {
            toast.error("No se encontró la marca a editar");
            return;
        }

        const result = isEdit && brand ? await updateBrand(brand, values) : await createBrand(values);

        if (result.ok === false) {
            toast.error(result.error);
            return;
        }

        if (isEdit && result.data === brand) {
            onClose();
            return;
        }

        toast.success(isEdit ? `Cambios de ${result.data.name} guardados` : `Marca ${result.data.name} creada`);
        onSuccess(result.data);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} title={isEdit ? "Editar marca" : "Nueva marca"} isBusy={isSaving} onClose={onClose}>
            <BrandForm
                initialValues={isEdit && brand ? toBrandFormValues(brand) : EMPTY_BRAND_FORM}
                submitLabel={isEdit ? "Guardar cambios" : "Crear marca"}
                isSaving={isSaving}
                onSubmit={handleSubmit}
                onCancel={onClose}
            />
        </Modal>
    );
}

interface BrandFormProps {
    initialValues: BrandFormValues;
    submitLabel: string;
    isSaving: boolean;
    onSubmit: (values: BrandFormValues) => void;
    onCancel: () => void;
}

function BrandForm({ initialValues, submitLabel, isSaving, onSubmit, onCancel }: BrandFormProps) {
    const { values, errors, handleChange, validate } = useBrandForm(initialValues);
    const nameId = useId();
    const errorId = `${nameId}-error`;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        onSubmit(values);
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div>
                <Label htmlFor={nameId} required>
                    Nombre
                </Label>
                <Input
                    id={nameId}
                    name="name"
                    type="text"
                    autoFocus
                    autoComplete="off"
                    placeholder="Ej. Truper"
                    value={values.name}
                    onChange={handleChange}
                    disabled={isSaving}
                    hasError={!!errors.name}
                    aria-describedby={errors.name ? errorId : undefined}
                />
                {errors.name && (
                    <p id={errorId} className="mt-1.5 text-xs text-rose-600">
                        {errors.name}
                    </p>
                )}
            </div>

            <div className="flex items-center justify-end gap-3">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
                    Cancelar
                </Button>
                <Button type="submit" isLoading={isSaving}>
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}
