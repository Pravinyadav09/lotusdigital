"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";

export default function SettingsPage() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [config, setConfig] = useState({
        discountThreshold: 10,
        geoRadius: 500,
        interestRate: 18,
        notifications: {
            whatsapp: true,
            email: true,
            sms: false
        },
        taxes: {
            gstGoods: 18,
            gstServices: 18
        }
    });

    if (user?.role !== "super_admin" && user?.role !== "sales_manager") {
        return <div className="p-8 text-center text-muted-foreground">Access Denied. Organizational settings are restricted to Managers & Admins.</div>;
    }

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            toast.success("Global Configuration Updated Successfully. All new workflows will follow these rules.");
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Global Settings</h2>
                    <p className="text-muted-foreground">Configure business rules, thresholds, and system behavior.</p>
                </div>
                <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            <Tabs defaultValue="business" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="business">Business Rules</TabsTrigger>
                    <TabsTrigger value="notifications">Communications</TabsTrigger>
                    <TabsTrigger value="taxes">GST & Finance</TabsTrigger>
                </TabsList>

                <TabsContent value="business" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Sales Thresholds</CardTitle>
                                <CardDescription>Rules for quotation approvals and discounts.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Max Auto-Approve Discount (%)</Label>
                                    <Input
                                        type="number"
                                        value={config.discountThreshold}
                                        onChange={(e) => setConfig({ ...config, discountThreshold: Number(e.target.value) })}
                                    />
                                    <p className="text-[10px] text-muted-foreground italic">Discounts above this will trigger mandatory Sales Manager approval.</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Field Sync Radius</CardTitle>
                                <CardDescription>GPS validation for field rep check-ins.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Verification Radius (Meters)</Label>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            type="number"
                                            value={config.geoRadius}
                                            onChange={(e) => setConfig({ ...config, geoRadius: Number(e.target.value) })}
                                        />
                                        <Icons.location className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground italic">Distance within which check-ins are marked as 'Verified'.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Automated Communications</CardTitle>
                            <CardDescription>Configure how alerts reach team members and customers.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between space-x-2">
                                <div className="space-y-0.5">
                                    <Label>WhatsApp Alerts</Label>
                                    <p className="text-xs text-muted-foreground">Send real-time EMI reminders and Quotation PDFs.</p>
                                </div>
                                <Switch
                                    checked={config.notifications.whatsapp}
                                    onCheckedChange={(v) => setConfig({ ...config, notifications: { ...config.notifications, whatsapp: v } })}
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <div className="space-y-0.5">
                                    <Label>Email Notifications</Label>
                                    <p className="text-xs text-muted-foreground">Daily sales summaries and ticket assignments.</p>
                                </div>
                                <Switch
                                    checked={config.notifications.email}
                                    onCheckedChange={(v) => setConfig({ ...config, notifications: { ...config.notifications, email: v } })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="taxes" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Financial Compliance</CardTitle>
                            <CardDescription>Default tax rates and interest policies.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Standard GST (Goods)</Label>
                                    <Input
                                        type="number"
                                        value={config.taxes.gstGoods}
                                        onChange={(e) => setConfig({ ...config, taxes: { ...config.taxes, gstGoods: Number(e.target.value) } })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Service SAC (GST)</Label>
                                    <Input
                                        type="number"
                                        value={config.taxes.gstServices}
                                        onChange={(e) => setConfig({ ...config, taxes: { ...config.taxes, gstServices: Number(e.target.value) } })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 border-t pt-4">
                                <Label>Delay Interest (Simple 18% p.a.)</Label>
                                <Input type="number" value={config.interestRate} readOnly className="bg-muted" />
                                <p className="text-[10px] text-red-600">Company policy: Non-editable without director approval.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
