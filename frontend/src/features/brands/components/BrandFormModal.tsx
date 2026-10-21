// =====================================================================
// H2 · Crear y editar una marca — Integrante 2
// Archivo: features/brands/components/BrandFormModal.tsx
// ---------------------------------------------------------------------
// QUÉ HACE: el ÚNICO formulario de marcas. Sirve para crear y para editar según `mode`.
//   mode="create" → "Nueva marca", campo vacío, botón "Crear marca", usa useCreateBrand
//   mode="edit"   → "Editar marca", nombre actual, botón "Guardar cambios", usa useUpdateBrand
//
// Está dividido en dos partes:
//   - BrandFormModal (exterior): guarda con los hooks y dibuja el <Modal> (isBusy mientras guarda).
//   - BrandForm (interior): estado del campo y validación. Va dentro del <Modal>, que no
//     renderiza nada cuando está cerrado; por eso se monta de nuevo en cada apertura y el
//     formulario siempre empieza limpio (sin texto ni errores anteriores).
// =====================================================================
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

        // Error (409 nombre repetido, 403 sin permiso...): el modal sigue abierto con lo escrito
        if (result.ok === false) {
            toast.error(result.error);
            return;
        }

        // Edición sin cambios: el hook devuelve la misma marca → solo cerrar
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

// ==========================================
// Formulario interno (se monta al abrir el modal)
// ==========================================
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
        // Si no pasa la validación, el error se muestra y NO se llama al backend
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
