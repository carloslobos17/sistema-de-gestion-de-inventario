interface ErrorMessageProps {
    message?: string;
    id?: string;
}

export function ErrorMessage({ message, id }: ErrorMessageProps) {
    if (!message) return null;
    return (
        <p id={id} role="alert" className="mt-1.5 text-sm text-red-600">
            {message}
        </p>
    );
}