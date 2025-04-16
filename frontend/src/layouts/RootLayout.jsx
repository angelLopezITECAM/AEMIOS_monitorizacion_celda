import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "@/errors/ErrorBoundary";

import { Header } from "@/components/ui/app/header";
import { AppSidebar } from "@/components/ui/app/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export function RootLayout() {
    return <>
        <ErrorBoundary>
            <SidebarProvider>
                <AppSidebar />
                <div className="relative flex min-h-svh flex-1 flex-col bg-background peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow">

                    <Header />
                    <main className="min-h-screen p-4 sm:p-6">
                        <Outlet />
                    </main>

                </div>
            </SidebarProvider>

        </ErrorBoundary>
    </>;
}