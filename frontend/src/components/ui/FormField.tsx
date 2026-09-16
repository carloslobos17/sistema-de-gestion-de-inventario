import { forwardRef, type InputHTMLAttributes } from "react";
import { Label } from "./Label";
import { Input } from "./Input";
import { ErrorMessage } from "./ErrorMessage";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: string;
    error?: string;
    required?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
    ({ label, name, error, required, ...rest }, ref) => {
        const errorId = error ? `${name}-error` : undefined;

        return (
            <div>
                <Label htmlFor={name} required={required}>{label}</Label>
                <Input ref={ref} id={name} name={name} hasError={Boolean(error)} aria-describedby={errorId} {...rest} />
                <ErrorMessage id={errorId} message={error} />
            </div>
        );
    }
);
FormField.displayName = "FormField";