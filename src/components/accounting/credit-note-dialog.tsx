"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icons } from "@/components/icons";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function CreditNoteDialog() {
    const [open, setOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Credit Note CN-2024-001 issued and adjusted against customer ledger.");
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    <Icons.add className="mr-2 h-4 w-4" />
                    Issue Credit Note
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Issue Credit Note</DialogTitle>
                    <DialogDescription>
                        Identify the original invoice and the reversal amount for goods return or price adjustment.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label>Customer</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select customer" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="c1">Pixel Printers</SelectItem>
                                <SelectItem value="c2">Sharma Graphics</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Reference Tax Invoice</Label>
                            <Input placeholder="e.g. TI-2024-001" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Reversal Amount (₹)</Label>
                            <Input type="number" placeholder="0.00" />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Reason for Reversal</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select reason" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="damaged">Goods Damaged in Transit</SelectItem>
                                <SelectItem value="incorrect">Incorrect Pricing/Billing</SelectItem>
                                <SelectItem value="return">Sales Return (Machine Component)</SelectItem>
                                <SelectItem value="discount">Post-Sales Scheme Discount</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Internal Notes</Label>
                        <Textarea placeholder="Explain why this credit is being issued..." />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" className="bg-red-600 hover:bg-red-700">Issue & Post to Ledger</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
