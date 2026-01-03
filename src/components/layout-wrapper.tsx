"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Separator } from "@/components/ui/separator";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // Hide sidebar on login page and root page (which redirects)
    const shouldHideSidebar = pathname === "/login" || pathname === "/";

    if (shouldHideSidebar) {
        return (
            <>
                <main className="flex-1 h-screen w-full">
                    {children}
                </main>
                <Toaster />
            </>
        );
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 md:hidden z-10">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <span className="font-semibold">Lotus Digital</span>
                </header>
                <main className="flex-1 overflow-auto h-screen flex flex-col pt-2 bg-muted/10">
                    {children}
                </main>
                <Toaster />
            </SidebarInset>
        </SidebarProvider>
    );
}
