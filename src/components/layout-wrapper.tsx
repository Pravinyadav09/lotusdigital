"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Icons } from "@/components/icons";
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
                <header className="flex sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-14 shrink-0 items-center gap-2 border-b px-4 z-10">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="flex-1 flex items-center justify-between">
                        <span className="font-semibold text-sm md:text-base">Lotus Digital</span>
                        <div className="hidden md:flex items-center gap-2 text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full border">
                            <Icons.check className="h-3 w-3 text-green-500" />
                            <span>System Online: v1.4.2</span>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-auto h-[calc(100vh-3.5rem)] flex flex-col bg-muted/5">
                    <div className="flex-1 w-full max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
                <Toaster />
            </SidebarInset>
        </SidebarProvider>
    );
}
