import { useState, type FormEvent } from "react";
import { loginSchema } from "../schemas/login.schema";
import type { LoginCredentials, LoginFormErrors } from "../auth.types.ts";

interface UseLoginFormProps {
    onSubmit: (credentials: LoginCredentials) => Promise<unknown>;
}

export function useLoginForm({ onSubmit }: UseLoginFormProps) {
    const [formData, setFormData] = useState<LoginCredentials>({
        nombre_usuario: "",
        password: "",
    });
    const [errors, setErrors] = useState<LoginFormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    function handleChange(field: keyof LoginCredentials, value: string) {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const result = loginSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors: LoginFormErrors = {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof LoginFormErrors;
                fieldErrors[field] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setIsLoading(true);
        try {
            await onSubmit(result.data);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Credenciales inválidas";
            setErrors({ general: message });
        } finally {
            setIsLoading(false);
        }
    }

    return {
        formData,
        errors,
        isLoading,
        handleChange,
        handleSubmit,
    };
}