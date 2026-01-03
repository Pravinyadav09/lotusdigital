"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Mock Credentials Database
const MOCK_USERS: Record<string, { pass: string; role: UserRole; name: string }> = {
    "admin@lotus.com": { pass: "Admin@123", role: "super_admin", name: "Super Admin" },
    "manager@lotus.com": { pass: "Manager@123", role: "sales_manager", name: "Sales Manager" },
    "sales1@lotus.com": { pass: "Sales@123", role: "senior_sales_rep", name: "Rahul Sales" },
    "finance@lotus.com": { pass: "Finance@123", role: "finance_user", name: "Priya Finance" },
    "service1@lotus.com": { pass: "Service@123", role: "service_engineer", name: "Amit Service" },
    "customer1@xyz.com": { pass: "Cust@123", role: "customer", name: "Lotus Prints (Client)" },
};

interface AuthContextType {
    user: User | null;
    login: (email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Check local storage for persisted session
        const stored = localStorage.getItem("lotus_user");
        if (stored) {
            try {
                setUser(JSON.parse(stored));
                // Ensure cookie exists for middleware
                document.cookie = "lotus_session=true; path=/; max-age=86400; SameSite=Lax";
            } catch (e) {
                console.error("Failed to parse user session");
            }
        }
    }, []);

    const login = async (email: string, pass: string) => {
        // Simulate API call
        return new Promise<boolean>((resolve) => {
            setTimeout(() => {
                const mockUser = MOCK_USERS[email];
                if (mockUser && mockUser.pass === pass) {
                    const newUser: User = {
                        id: email,
                        email,
                        name: mockUser.name,
                        role: mockUser.role,
                    };
                    setUser(newUser);
                    localStorage.setItem("lotus_user", JSON.stringify(newUser));
                    // Sync cookie for middleware
                    document.cookie = "lotus_session=true; path=/; max-age=86400; SameSite=Lax";
                    toast.success(`Welcome back, ${mockUser.name}`);
                    resolve(true);
                } else {
                    toast.error("Invalid Credentials. Try sample logins provided.");
                    resolve(false);
                }
            }, 800);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("lotus_user");
        // Clear cookie
        document.cookie = "lotus_session=; path=/; max-age=0; SameSite=Lax";
        router.push("/login");
        toast.info("Logged out successfully");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
