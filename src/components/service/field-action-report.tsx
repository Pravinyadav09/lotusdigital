"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

export function FieldActionReport({ ticketId }: { ticketId: string }) {
    const [open, setOpen] = useState(false);
    const [signed, setSigned] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!signed) {
            toast.error("Customer signature is mandatory for Field Action Report.");
            return;
        }
        toast.promise(new Promise(r => setTimeout(r, 1500)), {
            loading: 'Generating Digitally Signed FAR...',
            success: 'Report Successfully Uploaded! Customer copy sent via WhatsApp.',
            error: 'Upload failed'
        });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    <Icons.reports className="mr-2 h-4 w-4" />
                    Complete Field Report (FAR)
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Field Action Report: {ticketId}</DialogTitle>
                    <DialogDescription>
                        Summary of work, parts replaced, and customer satisfaction.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="installed" defaultChecked />
                            <Label htmlFor="installed" className="text-sm">Machine Cleaned & Optimized</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="tested" defaultChecked />
                            <Label htmlFor="tested" className="text-sm">Test Print Alignment Verified</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="trained" />
                            <Label htmlFor="trained" className="text-sm">Operator Refresher Training Provided</Label>
                        </div>
                    </div>

                    <div className="space-y-4 border-t pt-4">
                        <Label className="text-sm font-bold">Spare Parts & Consumables (Billable)</Label>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs p-2 bg-muted/50 rounded">
                                <span>Filter Element (LX-9) - X1</span>
                                <span className="font-bold">₹ 1,250</span>
                            </div>
                            <div className="flex items-center justify-between text-xs p-2 bg-muted/50 rounded">
                                <span>Service Visit Fee (Out of Warranty)</span>
                                <span className="font-bold">₹ 2,500</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold px-2 text-primary">
                            <span>Total Visit Value:</span>
                            <span>₹ 3,750</span>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Engineer's Critical Notes</Label>
                        <Textarea placeholder="Mention any upcoming part requirements or site issues (e.g. voltage fluctuations)" />
                    </div>

                    <div className="space-y-2">
                        <Label>Customer Digital Signature</Label>
                        <div className="h-32 w-full border-2 border-dashed rounded-lg bg-slate-50 flex items-center justify-center relative group cursor-crosshair" onClick={() => setSigned(true)}>
                            {signed ? (
                                <div className="text-blue-600 italic font-serif text-2xl select-none">
                                    Rajesh Kumar
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                                    Click / Tap to sign (Simulated Pad)
                                </p>
                            )}
                            {signed && <Icons.check className="absolute top-2 right-2 h-4 w-4 text-green-600" />}
                        </div>
                        <p className="text-[10px] text-muted-foreground italic">
                            By signing, the customer acknowledges that the machine is running as per Lotus Digital quality standards.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={!signed} className="bg-primary hover:bg-primary/90">
                            Sync & Close Visit
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
