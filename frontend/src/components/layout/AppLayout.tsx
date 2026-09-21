// src/components/layout/AppLayout.tsx
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function AppLayout() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Navbar />
            <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
}