"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { useState } from "react";

// Mock Audit Data
const AUDIT_LOGS = [
    { id: "LOG-001", timestamp: "2024-05-05 10:30 AM", user: "Super Admin", action: "UPDATE_PRICE", details: "Changed base price of Lotus X1 to ₹4,60,000", module: "Catalog" },
    { id: "LOG-002", timestamp: "2024-05-05 11:15 AM", user: "Sales Manager", action: "APPROVE_DISCOUNT", details: "Approved 12% discount for Quote Q-2024-003", module: "Sales" },
    { id: "LOG-003", timestamp: "2024-05-04 02:45 PM", user: "Finance User", action: "GENERATE_INVOICE", details: "Generated Tax Invoice INV-2024-089", module: "Accounting" },
    { id: "LOG-004", timestamp: "2024-05-04 09:00 AM", user: "Super Admin", action: "USER_ADD", details: "Created new user 'Rahul Sharma' (Sales Rep)", module: "Settings" },
    { id: "LOG-005", timestamp: "2024-05-03 04:30 PM", user: "Service Engineer", action: "CLOSE_TICKET", details: "Closed Ticket #SR-992 (Head Replacement)", module: "Service" },
];

export default function AuditLogsPage() {
    const [search, setSearch] = useState("");

    const filteredLogs = AUDIT_LOGS.filter(log =>
        log.user.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.details.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">System Audit Logs</h2>
                    <p className="text-muted-foreground">Immutable record of all critical system actions.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Icons.reports className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Activity Log</CardTitle>
                        <div className="relative w-64">
                            <Icons.search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search logs..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[180px]">Timestamp</TableHead>
                                <TableHead>User / Role</TableHead>
                                <TableHead>Module</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLogs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="text-xs text-muted-foreground font-mono">{log.timestamp}</TableCell>
                                    <TableCell className="font-medium">{log.user}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{log.module}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={log.action.includes("UPDATE") || log.action.includes("DELETE") ? "destructive" : "secondary"}>
                                            {log.action}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm max-w-sm truncate" title={log.details}>{log.details}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

import { Button } from "@/components/ui/button";
