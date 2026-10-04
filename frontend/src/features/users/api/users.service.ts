import { apiClient } from "../../../api/axiosConfig";
import { getErrorMessage } from "../../../api/getErrorMessage";
import type { UserItem } from "../users.types";

export async function fetchUsers(): Promise<UserItem[]> {
    try {
        const { data } = await apiClient.get<{ data: UserItem[] }>("/users");
        return data.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "No se pudieron cargar los usuarios"));
    }
}


