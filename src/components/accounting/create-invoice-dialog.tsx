"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function CreateInvoiceDialog() {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState("pi");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(`${type === "pi" ? "Proforma" : "Tax"} Invoice generated successfully!`);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Icons.add className="mr-2 h-4 w-4" />
                    New Invoice
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Invoice</DialogTitle>
                    <DialogDescription>
                        {type === "tax" ? "Generate a GST-compliant Tax Invoice with clear item classification." : "Generate a Proforma Invoice (PI) for customer pre-payment."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Invoice Type</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pi">Proforma Invoice (PI)</SelectItem>
                                    <SelectItem value="tax">Tax Invoice</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Date</Label>
                            <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Customer / Lead</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select customer" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="c1">Pixel Printers (Rajesh Kumar)</SelectItem>
                                    <SelectItem value="c2">Sharma Graphics (Anita Sharma)</SelectItem>
                                    <SelectItem value="c3">Singh Graphics (Vikram Singh)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Associated Quote / PI</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select reference" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="q1">Q-2024-001 (₹ 8.5L)</SelectItem>
                                    <SelectItem value="q2">Q-2024-004 (₹ 12.5L)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {type === "tax" && (
                        <div className="space-y-4 border rounded-lg p-3 md:p-4 bg-muted/30">
                            <h4 className="text-sm font-semibold border-b pb-2">3-Section GST Mapping</h4>

                            <div className="space-y-6 md:space-y-3">
                                {/* Section 1: Goods */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-center gap-2 md:gap-4">
                                    <Label className="text-xs font-bold md:font-normal">Body Billable</Label>
                                    <Badge variant="outline" className="text-[10px] w-fit">SUPPLY OF GOODS</Badge>
                                    <div className="flex gap-2 w-full">
                                        <Input className="h-8 text-[10px] md:text-xs flex-1" placeholder="HSN: 8443" defaultValue="HSN: 8443" readOnly />
                                        <Input className="h-8 text-[10px] md:text-xs flex-1" placeholder="GST: 18%" defaultValue="GST: 18%" readOnly />
                                    </div>
                                </div>

                                {/* Section 2: Service */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-center gap-2 md:gap-4">
                                    <Label className="text-xs font-bold md:font-normal">Service Clause</Label>
                                    <Badge variant="outline" className="text-[10px] w-fit bg-blue-50">SUPPLY OF SERVICE</Badge>
                                    <div className="flex gap-2 w-full">
                                        <Input className="h-8 text-[10px] md:text-xs flex-1" placeholder="SAC: 9987" defaultValue="SAC: 9987" readOnly />
                                        <Input className="h-8 text-[10px] md:text-xs flex-1" placeholder="GST: 18%" defaultValue="GST: 18%" readOnly />
                                    </div>
                                </div>

                                {/* Section 3: Accessories */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-center gap-2 md:gap-4">
                                    <Label className="text-xs font-bold md:font-normal">Accessories</Label>
                                    <Badge variant="outline" className="text-[10px] w-fit">SUPPLY OF GOODS</Badge>
                                    <div className="flex gap-2 w-full">
                                        <Input className="h-8 text-[10px] md:text-xs flex-1" placeholder="HSN: 8443" defaultValue="HSN: 8443" readOnly />
                                        <Input className="h-8 text-[10px] md:text-xs flex-1" placeholder="GST: 18%" defaultValue="GST: 18%" readOnly />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 flex justify-between items-center text-sm font-bold border-t">
                                <span>Total Taxable Amount:</span>
                                <span>₹ 12,50,000</span>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => toast.info("PDF Preview Generated")}>
                            <Icons.view className="mr-2 h-4 w-4" />
                            Preview PDF
                        </Button>
                        <Button type="submit">Generate {type === "tax" ? "Tax" : "Proforma"} Invoice</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
