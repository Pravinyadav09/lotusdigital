"use client";

import { useAuth } from "@/providers/auth-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { CreateTicketDialog } from "@/components/service/create-ticket-dialog";
import { MachineLogsDialog } from "@/components/service/machine-logs-dialog";
import { toast } from "sonner";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const MOCK_MACHINES = [
    {
        id: "KONICA-512-004",
        model: "Konica Minolta AccurioPress C3070",
        owner: "Singh Graphics",
        status: "Running",
        warrantyTill: "2024-12-15",
        health: "98%",
        lastService: "2024-03-10"
    },
    {
        id: "LP-2000-B5",
        model: "Lotus Print Mini 2000",
        owner: "Singh Graphics",
        status: "Locked",
        reason: "Payment Overdue (EMI #4)",
        warrantyTill: "2025-02-20",
        health: "75%",
        lastService: "2024-04-05"
    },
    {
        id: "KONICA-X1-992",
        model: "Konica Minolta AccurioPress C4080",
        owner: "Pixel Printers",
        status: "Running",
        warrantyTill: "2025-01-10",
        health: "100%",
        lastService: "2024-05-01"
    }
];

export default function MachinesPage() {
    const { user } = useAuth();
    const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
    const [isLogsOpen, setIsLogsOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const isCustomer = user?.role === "customer";

    const filteredMachines = isCustomer
        ? MOCK_MACHINES.filter(m => m.owner === user?.name)
        : MOCK_MACHINES;

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {isCustomer ? "My Machines" : "Machine Inventory"}
                    </h2>
                    <p className="text-muted-foreground">
                        {isCustomer ? "Monitor your installed machines and their status." : "Overview of all installed machines across the region."}
                    </p>
                </div>
                {isCustomer && <CreateTicketDialog />}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredMachines.map((machine) => (
                    <Card key={machine.id} className={machine.status === 'Locked' ? 'border-red-200 bg-red-50/10' : ''}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <Badge variant="outline" className="mb-2">{machine.id}</Badge>
                                    <CardTitle className="text-lg">{machine.model}</CardTitle>
                                    {!isCustomer && <CardDescription>{machine.owner}</CardDescription>}
                                </div>
                                <Badge variant={machine.status === 'Running' ? 'default' : 'destructive'} className={machine.status === 'Running' ? 'bg-green-600' : ''}>
                                    {machine.status.toUpperCase()}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Health</p>
                                    <p className="font-bold text-blue-600">{machine.health}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Warranty Till</p>
                                    <p className="font-semibold">{machine.warrantyTill}</p>
                                </div>
                            </div>

                            {machine.status === 'Locked' && (
                                <div className="p-3 bg-red-100 border border-red-200 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Icons.warning className="h-4 w-4 text-red-600" />
                                        <span className="text-xs font-bold text-red-700">LOCK REASON</span>
                                    </div>
                                    <p className="text-xs text-red-600">{machine.reason}</p>
                                    <Button variant="link" className="h-auto p-0 text-xs text-red-700 underline mt-2 font-bold italic" onClick={() => toast.info("Dialing Finance Department: +91 11 4567 8901")}>
                                        Contact Finance to Unlock
                                    </Button>
                                </div>
                            )}

                            <div className="pt-4 border-t flex justify-between items-center">
                                <span className="text-xs text-muted-foreground italic">Last Service: {machine.lastService}</span>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8"
                                        onClick={() => {
                                            setSelectedMachine(machine.id);
                                            setIsLogsOpen(true);
                                        }}
                                    >
                                        <Icons.history className="h-3 w-3 mr-1" />
                                        Logs
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8"
                                        onClick={() => {
                                            setSelectedMachine(machine.id);
                                            setIsDetailsOpen(true);
                                        }}
                                    >
                                        <Icons.view className="h-3 w-3 mr-1" />
                                        Details
                                    </Button>
                                    {isCustomer && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            onClick={() => {
                                                toast.promise(new Promise(r => setTimeout(r, 4000)), {
                                                    loading: `Querying BIOS for ${machine.id}... Checking Printhead Logic...`,
                                                    success: `System Check Complete: All sub-systems healthy. Temperature: 24°C. Voltage: Stable.`,
                                                    error: 'Diagnostics Failed'
                                                })
                                            }}
                                        >
                                            <Icons.settings className="h-3 w-3 mr-1" />
                                            Deep Scan
                                        </Button>
                                    )}
                                    {isCustomer && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 border-green-200 text-green-700 bg-green-50"
                                            onClick={() => {
                                                toast.success(`Service request logged for machine ${machine.id}. Engineer will be assigned shortly.`);
                                            }}
                                        >
                                            <Icons.add className="h-3 w-3 mr-1" />
                                            Service
                                        </Button>
                                    )}
                                    {user?.role === 'super_admin' && (
                                        <Button
                                            variant={machine.status === 'Locked' ? 'outline' : 'destructive'}
                                            size="sm"
                                            className="h-8"
                                            onClick={() => {
                                                const action = machine.status === 'Locked' ? 'Unlocked' : 'Locked';
                                                toast.success(`Administrative Action: Machine ${machine.id} has been ${action}. Auth: Master Key.`);
                                            }}
                                        >
                                            <Icons.settings className="h-3 w-3 mr-1" />
                                            {machine.status === 'Locked' ? 'Unlock' : 'Lock'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {/* Interactions */}
                {selectedMachine && (
                    <>
                        <MachineLogsDialog
                            machineId={selectedMachine}
                            open={isLogsOpen}
                            onOpenChange={setIsLogsOpen}
                        />

                        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                            <DialogContent className="max-w-xl">
                                <DialogHeader>
                                    <DialogTitle>Technical Specs: {selectedMachine}</DialogTitle>
                                    <DialogDescription>Engineering and configuration master data.</DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-6 p-4 border rounded-lg bg-slate-50">
                                    <div>
                                        <p className="text-[10px] uppercase text-muted-foreground font-bold">Printheads</p>
                                        <p className="text-sm font-semibold">Konica Minolta 512i (High Density)</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-muted-foreground font-bold">Printing Width</p>
                                        <p className="text-sm font-semibold">3.2 Meters (10.5 ft)</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-muted-foreground font-bold">Max Resolution</p>
                                        <p className="text-sm font-semibold">1440 DPI (Variable Drop)</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-muted-foreground font-bold">Ink Type</p>
                                        <p className="text-sm font-semibold">Certified Solvent / Eco-Solvent</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-[10px] uppercase text-muted-foreground font-bold">Mainboard Firmware</p>
                                        <p className="text-sm font-semibold font-mono">v4.2.1-stable-LX-2024</p>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <Button size="sm" variant="outline" onClick={() => toast.info("Downloading technical manual...")}>
                                        <Icons.reports className="mr-2 h-3 w-3" /> Manual
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </>
                )}
            </div>
        </div>
    );
}

