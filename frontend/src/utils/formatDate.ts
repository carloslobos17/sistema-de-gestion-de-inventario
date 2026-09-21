export function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("es", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}