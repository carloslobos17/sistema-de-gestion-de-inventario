// src/features/categories/components/CategoryFormModal.tsx
// Único formulario de categorías (crear y editar según `mode`).
//   - CategoryFormModal: guarda con los hooks y dibuja el <Modal>.
//   - CategoryForm: campo y validación. Se monta al abrir el modal, así siempre empieza limpio.
import { useId, type FormEvent } from "react";
import { toast } from "sonner";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { useCategoryForm } from "../hooks/useCategoryForm";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { useUpdateCategory } from "../hooks/useUpdateCategory";
import { EMPTY_CATEGORY_FORM } from "../model/categories.constants";
import { toCategoryFormValues } from "../model/categories.mappers";
import type { CategoryFormModalProps, CategoryFormProps, CategoryFormValues } from "../model/categories.types";

export function CategoryFormModal({ isOpen, mode, category, onClose, onSuccess }: CategoryFormModalProps) {
    const isEdit = mode === "edit";
    const { createCategory, isSaving: isCreating } = useCreateCategory();
    const { updateCategory, isSaving: isUpdating } = useUpdateCategory();
    const isSaving = isCreating || isUpdating;

    const handleSubmit = async (values: CategoryFormValues) => {
        if (isSaving) return;

        if (isEdit && !category) {
            toast.error("No se encontró la categoría a editar");
            return;
        }

        const result = isEdit && category ? await updateCategory(category, values) : await createCategory(values);

        // Error (409 nombre repetido, 403 sin permiso...): el modal sigue abierto con lo escrito
        if (result.ok === false) {
            toast.error(result.error);
            return;
        }

        // Edición sin cambios (el hook no llamó al backend) → solo cerrar, sin toast
        if (isEdit && category && result.data.name === category.name) {
            onClose();
            return;
        }

        toast.success(isEdit ? `Cambios de ${result.data.name} guardados` : `Categoría ${result.data.name} creada`);
        onSuccess(result.data);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} title={isEdit ? "Editar categoría" : "Nueva categoría"} isBusy={isSaving} onClose={onClose}>
            <CategoryForm
                initialValues={isEdit && category ? toCategoryFormValues(category) : EMPTY_CATEGORY_FORM}
                submitLabel={isEdit ? "Guardar cambios" : "Crear categoría"}
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
function CategoryForm({ initialValues, submitLabel, isSaving, onSubmit, onCancel }: CategoryFormProps) {
    const { values, errors, handleChange, validate } = useCategoryForm(initialValues);
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
                    placeholder="Ej. Herramientas"
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
