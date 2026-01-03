"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

export default function Page() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="animate-pulse text-xl font-semibold text-muted-foreground">
        Loading Lotus Digital Systems...
      </div>
    </div>
  );
}
