"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { Lead } from "@/lib/types";
import { toast } from "sonner";

interface CreateLeadDialogProps {
    onLeadCreate: (lead: Lead) => void;
}

export function CreateLeadDialog({ onLeadCreate }: CreateLeadDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        mobile: "",
        email: "",
        source: "",
        interest: "",
        address: "",
        notes: "",
        followUpDate: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate
        if (!formData.name || !formData.mobile || !formData.company || !formData.followUpDate) {
            toast.error("Please fill in all mandatory fields (Name, Mobile, Company, Follow-up Date)");
            setIsLoading(false);
            return;
        }

        // Duplicate Detection Logic (Business Rule)
        const isDuplicateMobile = formData.mobile.includes("9876543210");
        const isDuplicateCompany = formData.company.toLowerCase().includes("pixel");

        if (isDuplicateMobile || isDuplicateCompany) {
            toast.error("DUPLICATE DETECTED: A lead with this mobile or company already exists (#L-101). Creation blocked.");
            setIsLoading(false);
            return;
        }

        // Simulate API delay
        setTimeout(() => {
            const newLead: Lead = {
                id: `L-${Math.floor(Math.random() * 10000)}`,
                customerName: formData.name,
                companyName: formData.company,
                mobile: formData.mobile,
                status: 'new',
                productInterest: [formData.interest || "General Inquiry"],
                createdAt: new Date().toISOString(),
                lastActivity: "Just now"
            };

            onLeadCreate(newLead);
            toast.success("Lead created successfully");
            setOpen(false);
            setIsLoading(false);
            setFormData({
                name: "", company: "", mobile: "", email: "", source: "", interest: "", address: "", notes: "", followUpDate: ""
            });
        }, 1000);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Icons.add className="mr-2 h-4 w-4" />
                    New Lead
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create New Lead</DialogTitle>
                    <DialogDescription>
                        Enter potential customer details clearly. Duplicate mobile check is active.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Customer Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Rahul Sharma"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="company">Company Name *</Label>
                            <Input
                                id="company"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                placeholder="e.g. Sharma Prints"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="mobile">Mobile Number *</Label>
                            <Input
                                id="mobile"
                                value={formData.mobile}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                placeholder="+91 XXXXX XXXXX"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="customer@example.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Lead Source</Label>
                            <Select onValueChange={(v) => setFormData({ ...formData, source: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Source" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="website">Website Inquiry</SelectItem>
                                    <SelectItem value="referral">Customer Referral</SelectItem>
                                    <SelectItem value="cold_field">Field Visit (Cold)</SelectItem>
                                    <SelectItem value="exhibition">Exhibition/Trade Show</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Primary Product Interest</Label>
                            <Select onValueChange={(v) => setFormData({ ...formData, interest: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Product" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Konica 512i">Konica 512i Series</SelectItem>
                                    <SelectItem value="Starfire 1024">Starfire 1024</SelectItem>
                                    <SelectItem value="Ricoh Gen5">Ricoh Gen5 UV</SelectItem>
                                    <SelectItem value="Laser Cutter">Laser Cutter Co2</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address">Address & Location</Label>
                        <Textarea
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Shop No, Street, City, State"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="followUp">First Follow-up Date *</Label>
                            <Input
                                id="followUp"
                                type="date"
                                value={formData.followUpDate}
                                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="notes">Initial Notes</Label>
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Budget range, urgency, special requirements..."
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Save Lead"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
