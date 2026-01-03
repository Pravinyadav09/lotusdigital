"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";

interface MachineLog {
    id: string;
    timestamp: string;
    action: string;
    user: string;
    status: string;
}

const MOCK_LOGS: Record<string, MachineLog[]> = {
    "KONICA-512-004": [
        { id: "1", timestamp: "2024-05-02 10:00", action: "System Health Check", user: "Auto", status: "Success" },
        { id: "2", timestamp: "2024-05-01 14:30", action: "Service Completed", user: "Amit Service", status: "Running" },
        { id: "3", timestamp: "2024-04-28 09:12", action: "Maintenance Alert", user: "Sensor-B2", status: "Warning" },
    ],
    "LP-2000-B5": [
        { id: "1", timestamp: "2024-05-02 11:30", action: "Manual Unlock Attempt", user: "Customer", status: "Refused" },
        { id: "2", timestamp: "2024-05-01 09:00", action: "Financial Lockdown", user: "Admin", status: "Locked" },
        { id: "3", timestamp: "2024-04-30 16:45", action: "Payment Overdue Detection", user: "Auto-Billing", status: "Alert" },
    ]
};

export function MachineLogsDialog({
    machineId,
    open,
    onOpenChange
}: {
    machineId: string,
    open: boolean,
    onOpenChange: (open: boolean) => void
}) {
    const logs = MOCK_LOGS[machineId] || MOCK_LOGS["KONICA-512-004"];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Icons.history className="h-5 w-5 text-blue-600" />
                        Audit Logs: {machineId}
                    </DialogTitle>
                    <DialogDescription>
                        Full immutable history of machine interventions and automated health pings.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Initiated By</TableHead>
                                <TableHead className="text-right">Result</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id} className="text-xs">
                                    <TableCell className="text-muted-foreground">{log.timestamp}</TableCell>
                                    <TableCell className="font-medium">{log.action}</TableCell>
                                    <TableCell>{log.user}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="outline" className={
                                            log.status === 'Success' ? 'text-green-600 border-green-200 bg-green-50' :
                                                log.status === 'Locked' || log.status === 'Refused' ? 'text-red-600 border-red-200 bg-red-50' : ''
                                        }>
                                            {log.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    );
}
