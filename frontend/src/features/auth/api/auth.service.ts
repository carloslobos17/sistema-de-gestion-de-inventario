import type { LoginCredentials, LoginResponse } from "../../../types/auth.types";

export async function loginWithCredentials(credentials: LoginCredentials): Promise<LoginResponse> {
    const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });

    const body = await res.json();

    if (!res.ok) {
        // Lanzamos el error para que el LoginForm lo atrape y lo pinte en rojo
        throw new Error(body.error ?? "No se pudo iniciar sesión");
    }

    return body;
}