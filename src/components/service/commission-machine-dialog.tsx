"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export function CommissionMachineDialog({ machineId }: { machineId: string }) {
    const [open, setOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.promise(new Promise(r => setTimeout(r, 2000)), {
            loading: 'Registering Machine with Lotus Central Registry...',
            success: () => {
                return `Machine ${machineId} Commissioned! Warranty starts today.`;
            },
            error: 'Registration failed'
        });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="h-8 text-xs w-full sm:w-auto bg-primary hover:bg-primary/90">
                    <Icons.logo className="mr-2 h-4 w-4" />
                    Commission Machine
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Machine Commissioning & Warranty Activation</DialogTitle>
                    <DialogDescription>
                        Final on-site verification before handover to customer.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Machine ID</Label>
                            <Input defaultValue={machineId} readOnly className="bg-muted" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Installation Date</Label>
                            <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        <Label className="text-sm font-bold">On-Site Checklist</Label>
                        <div className="grid grid-cols-1 gap-2">
                            <div className="flex items-center gap-2 p-2 border rounded bg-slate-50">
                                <Icons.check className="h-4 w-4 text-green-600" />
                                <span className="text-xs">Voltage Stabilizer (Maintained 220V)</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 border rounded bg-slate-50">
                                <Icons.check className="h-4 w-4 text-green-600" />
                                <span className="text-xs">Grounding/Earth Wire Verified</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 border rounded bg-slate-50">
                                <Icons.check className="h-4 w-4 text-green-600" />
                                <span className="text-xs">Environmental Humidity (40-60%)</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Operator Trained (Name)</Label>
                        <Input placeholder="Full name of customer's operator" required />
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <p className="text-[10px] text-blue-800 italic">
                            <b>Legal Note:</b> Commissioning this machine will freeze the invoice and start the 12-month standard warranty period.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" className="bg-primary">Activate Warranty & Finish</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
