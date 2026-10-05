// =====================================================================
// H2 · Crear y editar una marca — Integrante 2
// Archivo: features/brands/components/BrandFormModal.tsx
// ---------------------------------------------------------------------
// QUÉ HACE: el ÚNICO formulario de marcas. Sirve para crear y para editar según `mode`.
//   mode="create" → título "Nueva marca", campo vacío, botón "Crear marca", usa useCreateBrand
//   mode="edit"   → título "Editar marca", nombre actual, botón "Guardar cambios", usa useUpdateBrand
//
// ESTADO ACTUAL: abre el <Modal> genérico con el título correcto, pero sin formulario.
//
// TAREAS:
//   [ ] Usar useBrandForm para el valor del campo "Nombre" y sus errores
//       - create: valores iniciales EMPTY_BRAND_FORM
//       - edit:   valores iniciales toBrandFormValues(brand) (model/brands.mappers.ts)
//   [ ] Campo "Nombre" con <Label> + <Input hasError={...}> + mensaje de error en rojo debajo
//       (autoFocus en el campo al abrir)
//   [ ] Al enviar (<form onSubmit>, con e.preventDefault()):
//       1. validar con useBrandForm (Zod); si falla, mostrar el error y NO llamar al backend
//       2. create → createBrand(values) · edit → updateBrand(brand, values)
//       3. si result.ok: toast.success("Marca X creada" / "Cambios de X guardados"),
//          llamar onSuccess(result.data) y cerrar con onClose()
//       4. si result.ok === false: toast.error(result.error)  (409 nombre repetido, 403 sin permiso)
//   [ ] Footer con <Button variant="secondary">Cancelar</Button> y
//       <Button type="submit" isLoading={isSaving}>Crear marca / Guardar cambios</Button>
//       (el botón submit debe estar dentro del <form> o usar el atributo form="id-del-form")
//   [ ] Pasar isBusy={isSaving} al <Modal> para que no se cierre mientras guarda
//   [ ] Al cerrar y volver a abrir, el formulario debe empezar limpio
//       (pista: renderizar el contenido solo cuando isOpen, o usar key)
//
// REUTILIZA: Modal, Button, Input, Label (components/ui), toast (sonner)
// NO CAMBIAR: las props (BrandFormModalProps). CreateBrandButton y EditBrandButton ya lo usan.
// REFERENCIA: features/users/components/UserForm.tsx (validación con Zod y errores por campo)
// =====================================================================
import { Modal } from "../../../components/ui/Modal";
import type { BrandFormModalProps } from "../model/brands.types";

export function BrandFormModal(props: BrandFormModalProps) {
    const isEdit = props.mode === "edit";

    return (
        <Modal isOpen={props.isOpen} title={isEdit ? "Editar marca" : "Nueva marca"} onClose={props.onClose}>
            {/* TODO H2: formulario (ver TAREAS arriba) */}
            <p className="text-sm text-zinc-500">Formulario pendiente (H2).</p>
        </Modal>
    );
}
