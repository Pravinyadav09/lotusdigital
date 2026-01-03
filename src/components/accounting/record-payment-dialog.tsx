"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Icons } from "@/components/icons";

export function RecordPaymentDialog({ trigger }: { trigger?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customerId: "",
        invoiceId: "",
        amount: "",
        mode: "neft",
        reference: "",
        date: new Date().toISOString().split('T')[0],
        notes: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setOpen(false);
            toast.success(`Payment of ₹${Number(formData.amount).toLocaleString()} recorded successfully!`);
            // Reset
            setFormData({
                customerId: "",
                invoiceId: "",
                amount: "",
                mode: "neft",
                reference: "",
                date: new Date().toISOString().split('T')[0],
                notes: ""
            });
        }, 1500);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Icons.add className="mr-2 h-4 w-4" />
                        Record Payment
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Record Payment Receipt</DialogTitle>
                    <DialogDescription>
                        Log a payment received from a customer against an invoice.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="customer">Customer</Label>
                            <Select
                                value={formData.customerId}
                                onValueChange={(v) => setFormData({ ...formData, customerId: v })}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Customer" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="c1">Pixel Printers</SelectItem>
                                    <SelectItem value="c2">Sharma Graphics</SelectItem>
                                    <SelectItem value="c3">Creative Ads</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="invoice">Link Invoice (Optional)</Label>
                            <Select
                                value={formData.invoiceId}
                                onValueChange={(v) => setFormData({ ...formData, invoiceId: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Invoice" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="inv1">INV-2024-001 (₹ 8.5L)</SelectItem>
                                    <SelectItem value="inv2">INV-2024-002 (₹ 4.5L)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount Received (₹)</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="0.00"
                                required
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="date">Payment Date</Label>
                            <Input
                                id="date"
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="mode">Payment Mode</Label>
                            <Select
                                value={formData.mode}
                                onValueChange={(v) => setFormData({ ...formData, mode: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="neft">NEFT / RTGS / IMPS</SelectItem>
                                    <SelectItem value="cheque">Cheque / DD</SelectItem>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="upi">UPI</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="reference">Reference / Cheque No.</Label>
                            <Input
                                id="reference"
                                placeholder="e.g. UTR12345678"
                                value={formData.reference}
                                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Remarks</Label>
                        <Textarea
                            id="notes"
                            placeholder="Add notes about TDS deduction or other details."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Recording..." : "Save Payment"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
