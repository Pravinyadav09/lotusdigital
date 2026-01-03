"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MOCK_AUDITS = [
    { id: "1", user: "Admin", action: "PRICE_OVERRIDE", detail: "Discount 15% on Q-2024-001 (Body Segment)", time: "2024-05-15 10:30 AM", ip: "106.213.14.88" },
    { id: "2", user: "Finance", action: "INVOICE_GEN", detail: "Tax Invoice TI-2024-088 Generated for Singh Graphics", time: "2024-05-15 11:15 AM", ip: "106.213.14.88" },
    { id: "3", user: "Vikram Rep", action: "GEO_CHECKIN", detail: "Lead: Pixel Printers (Distance: 154m)", time: "2024-05-15 09:45 AM", ip: "172.16.0.4 - GPS Verified" },
    { id: "4", user: "Manager", action: "QUOTE_APPROVE", detail: "Approved Q-2024-001. Config version V1 frozen.", time: "2024-05-14 04:20 PM", ip: "182.70.1.33" },
    { id: "5", user: "System", action: "MACHINE_LOCK", detail: "Machine SN: 2023-B5 locked due to 30+ days payment delay.", time: "2024-05-14 12:00 AM", ip: "Server-Cron" },
];

export default function AuditLogsPage() {
    const [search, setSearch] = useState("");

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">System Audit Trail</h2>
                    <p className="text-muted-foreground">Immutable record of all financial and pricing changes.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative w-64">
                        <Icons.search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Filter by user or action..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" onClick={() => toast.success("Audit Log CSV Exported (Audited Request)")}>
                        <Icons.history className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            <Card className="border-red-100">
                <CardHeader className="bg-red-50/10">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Icons.warning className="h-4 w-4 text-red-600" />
                        Integrity Verified
                    </CardTitle>
                    <CardDescription>
                        Records are hashed and immutable. Any alteration to these records will trigger a system-wide security alert.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>Source IP / GPS</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {MOCK_AUDITS.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="text-xs font-mono">{log.time}</TableCell>
                                    <TableCell className="font-medium text-sm">{log.user}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-[10px] font-bold">
                                            {log.action}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs">{log.detail}</TableCell>
                                    <TableCell className="text-[10px] text-muted-foreground">{log.ip}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => toast.info(`Viewing hash: ${Math.random().toString(36).substring(7)}`)}>
                                            <Icons.view className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted p-2 rounded">
                <p>Showing 5 of 12,450 records</p>
                <p>Audit Log Retention: 7 Years (GST Compliance)</p>
            </div>
        </div>
    );
}

