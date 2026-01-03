"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isAuthenticated && pathname !== "/login") {
            router.push("/login");
        }
    }, [isAuthenticated, pathname, router]);

    if (!isAuthenticated && pathname !== "/login") {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
        );
    }

    return <>{children}</>;
}
