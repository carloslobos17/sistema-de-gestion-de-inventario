import { Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";

export function AppLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-zinc-50/50 text-zinc-900">
            <AppHeader />
            <main className="w-full flex-1 p-4 md:p-8">
                <Outlet />
            </main>
        </div>
    );
}
