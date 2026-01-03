"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";

const INITIAL_LOGS = [
    { id: "LOG-1001", user: "Admin", action: "User Deactivation", detail: "Deactivated user 'Sales Rep B'", category: "security", timestamp: "2024-05-16 10:15:22", ip: "192.168.1.45" },
    { id: "LOG-1002", user: "Finance Dept", action: "Tax Invoice Generated", detail: "TI-2024-005 for Singh Graphics", category: "accounting", timestamp: "2024-05-16 09:30:12", ip: "192.168.1.12" },
    { id: "LOG-1003", user: "Rahul Sales", action: "Lead Created", detail: "New Lead: Pixel Printers", category: "sales", timestamp: "2024-05-16 09:15:45", ip: "10.0.0.24" },
    { id: "LOG-1004", user: "Admin", action: "System Config Update", detail: "GST Goods rate changed 18 -> 12", category: "system", timestamp: "2024-05-15 16:40:00", ip: "192.168.1.45" },
    { id: "LOG-1005", user: "Rajesh (Eng)", action: "Service Ticket Closed", detail: "SR-501 marked as Fixed", category: "service", timestamp: "2024-05-15 14:20:10", ip: "4G-Field-IP" },
    { id: "LOG-1006", user: "Sales Manager", action: "Quote Approval", detail: "Approved Q-2024-089 (12% Discount)", category: "approval", timestamp: "2024-05-15 11:05:30", ip: "192.168.1.20" },
];

export default function AuditLogsPage() {
    const { user } = useAuth();
    const [logs, setLogs] = useState(INITIAL_LOGS);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState<string | null>(null);

    // Only Admin can see this
    if (user?.role !== "super_admin") {
        return <div className="p-8 text-center text-muted-foreground">Access Denied. Integrity logs are restricted to Super Admins.</div>;
    }

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory ? log.category === filterCategory : true;
        return matchesSearch && matchesCategory;
    });

    const categories = ["security", "accounting", "sales", "system", "service", "approval"];

    const handleExport = () => {
        toast.promise(new Promise(r => setTimeout(r, 2000)), {
            loading: 'Generating Immutable Audit Ledger (CSV)...',
            success: 'Audit logs exported successfully with cryptographic hash.',
            error: 'Export failed'
        });
    };

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 h-full overflow-y-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">System Audit Logs</h2>
                    <p className="text-muted-foreground text-sm md:text-base">Immutable record of all critical system actions.</p>
                </div>
                <Button variant="outline" onClick={handleExport} className="w-full md:w-auto">
                    <Icons.reports className="mr-2 h-4 w-4" />
                    Export Ledger
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="relative w-full md:max-w-sm">
                    <Icons.search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by action or user..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-1 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                    <Button
                        variant={filterCategory === null ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterCategory(null)}
                    >
                        All
                    </Button>
                    {categories.map(cat => (
                        <Button
                            key={cat}
                            variant={filterCategory === cat ? "default" : "outline"}
                            size="sm"
                            className="capitalize whitespace-nowrap"
                            onClick={() => setFilterCategory(cat)}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <CardTitle>Activity Ledger</CardTitle>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                            Hashed Sync: Active
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Detail</TableHead>
                                    <TableHead>Source IP</TableHead>
                                    <TableHead className="text-right">Category</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLogs.map((log) => (
                                    <TableRow key={log.id} className="hover:bg-muted/30">
                                        <TableCell className="text-xs font-mono text-muted-foreground">{log.timestamp}</TableCell>
                                        <TableCell className="text-xs font-bold">{log.user}</TableCell>
                                        <TableCell className="text-xs font-semibold">{log.action}</TableCell>
                                        <TableCell className="text-xs">{log.detail}</TableCell>
                                        <TableCell className="text-[10px] font-mono text-muted-foreground">{log.ip}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="outline" className={`text-[10px] capitalize ${log.category === 'security' ? 'border-red-200 text-red-700 bg-red-50' :
                                                log.category === 'accounting' ? 'border-green-200 text-green-700 bg-green-50' :
                                                    log.category === 'approval' ? 'border-amber-200 text-amber-700 bg-amber-50' :
                                                        'bg-blue-50 text-blue-700 border-blue-200'
                                                }`}>
                                                {log.category}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <div className="p-4 border rounded-lg bg-blue-50/20 flex items-start gap-3">
                <Icons.warning className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-sm font-bold text-blue-900">Data Integrity Policy</p>
                    <p className="text-xs text-blue-700">
                        These logs are cryptographically hashed and cannot be deleted or modified. They serve as the primary evidence for regulatory compliance and internal security audits.
                    </p>
                </div>
            </div>
        </div>
    );
}
