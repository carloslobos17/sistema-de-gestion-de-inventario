import { useState, useEffect } from "react";
import { obtenerUsuarios } from "../api/usuarios.service";
import type { UsuarioItem } from "../usuarios.types.ts";

export function useUsuarios() {
    const [usuarios, setUsuarios] = useState<UsuarioItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUsuarios() {
            try {
                const data = await obtenerUsuarios();
                setUsuarios(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error desconocido");
            } finally {
                setIsLoading(false);
            }
        }

        fetchUsuarios();
    }, []);

    return { usuarios, isLoading, error };
}