import { apiClient } from "../../../api/axiosConfig";
import { getErrorMessage } from "../../../api/getErrorMessage";
import type { UsuarioItem } from "../usuarios.types";

export async function obtenerUsuarios(): Promise<UsuarioItem[]> {
    try {
        const { data } = await apiClient.get<{ datos: UsuarioItem[] }>("/usuarios");
        return data.datos;
    } catch (error) {
        throw new Error(getErrorMessage(error, "No se pudieron cargar los usuarios"));
    }
}