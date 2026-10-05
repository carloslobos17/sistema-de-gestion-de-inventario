// src/features/users/components/UserForm.tsx
import { useState, type FormEvent } from "react";
import { Loader2, Save } from "lucide-react";
import { useUserForm } from "../hooks/useUserForm";
import { ROLE_OPTIONS } from "../model/users.constants";
import { userFormSchema, type FormErrors } from "../model/users.validator";
import type { UserFormMode, UserFormValues } from "../model/users.types";

export interface UserFormProps {
    mode: UserFormMode;
    initialValues?: UserFormValues;
    isSaving: boolean;
    error: string | null;
    onSubmit: (values: UserFormValues) => void;
    onCancel: () => void;
}

const INPUT_CLASS =
    "h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50/30 px-4 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500";
const ERROR_INPUT_CLASS =
    "h-12 w-full rounded-xl border border-rose-300 bg-rose-50/30 px-4 text-zinc-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500";

export function UserForm({ mode, initialValues, isSaving, error, onSubmit, onCancel }: UserFormProps) {
    const { values, handleChange } = useUserForm(initialValues);
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
    const isEdit = mode === "edit";

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setFieldErrors({});

        // 1. Validamos en el frontend con Zod
        const result = userFormSchema(isEdit).safeParse(values);

        if (!result.success) {
            // Extraer y mapear errores a cada campo
            const formattedErrors: FormErrors = {};
            result.error.issues.forEach((issue) => {
                const fieldName = issue.path[0] as string;
                if (!formattedErrors[fieldName]) {
                    formattedErrors[fieldName] = issue.message;
                }
            });
            setFieldErrors(formattedErrors);
            return;
        }

        // 2. Si pasa Zod, enviamos al backend
        if (!isSaving) onSubmit(values);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col" noValidate>
            <div className="p-6 md:p-8">
                {error && (
                    <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Nombre */}
                    <div className="space-y-1.5">
                        <label htmlFor="first_name" className="text-sm font-bold text-zinc-500">Nombre</label>
                        <input
                            id="first_name"
                            name="first_name"
                            value={values.first_name}
                            onChange={handleChange}
                            className={fieldErrors.first_name ? ERROR_INPUT_CLASS : INPUT_CLASS}
                        />
                        {fieldErrors.first_name && (
                            <p className="text-xs text-rose-600">{fieldErrors.first_name}</p>
                        )}
                    </div>

                    {/* Apellido */}
                    <div className="space-y-1.5">
                        <label htmlFor="last_name" className="text-sm font-bold text-zinc-500">Apellido</label>
                        <input
                            id="last_name"
                            name="last_name"
                            value={values.last_name}
                            onChange={handleChange}
                            className={fieldErrors.last_name ? ERROR_INPUT_CLASS : INPUT_CLASS}
                        />
                        {fieldErrors.last_name && (
                            <p className="text-xs text-rose-600">{fieldErrors.last_name}</p>
                        )}
                    </div>

                    {/* Usuario */}
                    <div className="space-y-1.5">
                        <label htmlFor="username" className="text-sm font-bold text-zinc-500">Nombre de Usuario</label>
                        <input
                            id="username"
                            name="username"
                            value={values.username}
                            onChange={handleChange}
                            className={fieldErrors.username ? ERROR_INPUT_CLASS : INPUT_CLASS}
                        />
                        {fieldErrors.username && (
                            <p className="text-xs text-rose-600">{fieldErrors.username}</p>
                        )}
                    </div>

                    {/* Rol */}
                    <div className="space-y-1.5">
                        <label htmlFor="role_id" className="text-sm font-bold text-zinc-500">Rol del Sistema</label>
                        <select
                            id="role_id"
                            name="role_id"
                            value={values.role_id}
                            onChange={handleChange}
                            className={fieldErrors.role_id ? ERROR_INPUT_CLASS : INPUT_CLASS}
                        >
                            {ROLE_OPTIONS.map((role) => (
                                <option key={role.value} value={role.value}>{role.label}</option>
                            ))}
                        </select>
                        {fieldErrors.role_id && (
                            <p className="text-xs text-rose-600">{fieldErrors.role_id}</p>
                        )}
                    </div>

                    {/* Contraseña */}
                    <div className="space-y-1.5">
                        <label htmlFor="password" className="text-sm font-bold text-zinc-500">
                            {isEdit ? "Nueva Contraseña (opcional)" : "Contraseña"}
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder={isEdit ? "Déjala en blanco para conservar la actual" : "Mínimo 4 caracteres"}
                            value={values.password}
                            onChange={handleChange}
                            className={fieldErrors.password ? ERROR_INPUT_CLASS : INPUT_CLASS}
                        />
                        {fieldErrors.password && (
                            <p className="text-xs text-rose-600">{fieldErrors.password}</p>
                        )}
                    </div>

                    {/* Estado */}
                    {isEdit && (
                        <div className="space-y-3 md:col-span-2">
                            <div className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    name="is_active"
                                    checked={values.is_active}
                                    onChange={handleChange}
                                    className="mt-1 h-5 w-5 cursor-pointer rounded border-zinc-300 text-zinc-900"
                                />
                                <label htmlFor="is_active" className="cursor-pointer text-sm font-bold text-zinc-900">
                                    Cuenta Activa
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 border-t border-zinc-100 bg-zinc-50/50 p-6">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSaving}
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 disabled:opacity-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex h-11 min-w-[11rem] items-center justify-center rounded-xl bg-slate-900 px-8 font-bold text-white shadow-lg transition-all hover:bg-slate-800 disabled:opacity-70"
                >
                    {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> {isEdit ? "Guardar Cambios" : "Crear Usuario"}</>}
                </button>
            </div>
        </form>
    );
}