"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "", pass: "" });
    const router = useRouter();
    const { login, isAuthenticated } = useAuth();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.replace("/dashboard");
        }
    }, [isAuthenticated, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call via Context
        const success = await login(formData.email, formData.pass);

        if (success) {
            router.push("/dashboard");
        } else {
            setIsLoading(false);
        }
        // If success, useEffect will handle redirect based on isAuthenticated change
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-primary/10 p-4 text-primary">
                            <Icons.logo className="h-8 w-8" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Lotus Digital Systems</CardTitle>
                    <CardDescription>Enter your credentials to access the workspace</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="username"
                                placeholder="user@lotus-digital.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                value={formData.pass}
                                onChange={(e) => setFormData({ ...formData, pass: e.target.value })}
                                required
                            />
                        </div>
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                    <div className="mt-4 text-xs text-muted-foreground p-3 bg-muted rounded-md text-left space-y-1">
                        <div className="font-semibold mb-1">Click to fill Demo Logins:</div>
                        <div
                            className="cursor-pointer hover:text-primary hover:underline"
                            onClick={() => setFormData({ email: "admin@lotus.com", pass: "Admin@123" })}
                        >
                            <strong>Super Admin:</strong> admin@lotus.com / Admin@123
                        </div>
                        <div
                            className="cursor-pointer hover:text-primary hover:underline"
                            onClick={() => setFormData({ email: "manager@lotus.com", pass: "Manager@123" })}
                        >
                            <strong>Manager:</strong> manager@lotus.com / Manager@123
                        </div>
                        <div
                            className="cursor-pointer hover:text-primary hover:underline"
                            onClick={() => setFormData({ email: "sales1@lotus.com", pass: "Sales@123" })}
                        >
                            <strong>Sales Rep:</strong> sales1@lotus.com / Sales@123
                        </div>
                        <div
                            className="cursor-pointer hover:text-primary hover:underline"
                            onClick={() => setFormData({ email: "finance@lotus.com", pass: "Finance@123" })}
                        >
                            <strong>Finance:</strong> finance@lotus.com / Finance@123
                        </div>
                        <div
                            className="cursor-pointer hover:text-primary hover:underline"
                            onClick={() => setFormData({ email: "service1@lotus.com", pass: "Service@123" })}
                        >
                            <strong>Engineer:</strong> service1@lotus.com / Service@123
                        </div>
                        <div
                            className="cursor-pointer hover:text-primary hover:underline"
                            onClick={() => setFormData({ email: "customer1@xyz.com", pass: "Cust@123" })}
                        >
                            <strong>Customer:</strong> customer1@xyz.com / Cust@123
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
                    <div>Forgot password? Contact IT Support.</div>
                </CardFooter>
            </Card>
        </div>
    );
}
