import type { AuthUser } from "../auth.types";

export function useCurrentUser(): AuthUser | null {
    const raw = localStorage.getItem("user");
    if (!raw) return null;

    try {
        return JSON.parse(raw) as AuthUser;
    } catch {
        return null;
    }
}