import type { ReactNode } from "react";
import { AppHeader } from "./AppHeader";

interface AppLayoutProps {
    children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-zinc-50/50 text-zinc-900">
            <AppHeader />
            <main className="flex-1 w-full p-4 md:p-8">{children}</main>
        </div>
    );
}