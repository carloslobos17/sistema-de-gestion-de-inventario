import { useState, useEffect } from "react";
import { fetchUsers } from "../api/users.service";
import type { UserItem } from "../users.types";

export function useUsers() {
    const [users, setUsers] = useState<UserItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadUsers() {
            try {
                const data = await fetchUsers();
                setUsers(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error desconocido");
            } finally {
                setIsLoading(false);
            }
        }

        loadUsers();
    }, []);

    return { users, isLoading, error };
}