import type { LoginResponse } from "../auth.types";

type StoredUser = LoginResponse["datos"]["usuario"];

export function useCurrentUser(): StoredUser | null {
    const raw = localStorage.getItem("usuario");
    if (!raw) return null;

    try {
        return JSON.parse(raw) as StoredUser;
    } catch {
        return null;
    }
}