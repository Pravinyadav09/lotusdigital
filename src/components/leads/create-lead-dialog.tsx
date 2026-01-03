"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { Lead, LeadSource } from "@/lib/types";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface CreateLeadDialogProps {
    onLeadCreate: (lead: Lead) => void;
}

const MACHINES = [
    "Lotus Max 5000 (Inkjet)",
    "Lotus Pro 2000 (Laser)",
    "Lotus Hybrid X1",
    "Konica 512i (High Speed)",
    "Starfire 1024",
    "UV Flatbed 2513"
];

export function CreateLeadDialog({ onLeadCreate }: CreateLeadDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        mobile: "",
        email: "",
        source: "website" as LeadSource,
        interests: [] as string[],
        address: "",
        notes: "",
        followUpDate: "",
        photos: [] as string[]
    });

    const isDuplicate = (mobile: string, company: string) => {
        // Mock check - Business Rule: Combination of Mobile + Company must be unique
        return mobile === "9876543210" && company.toLowerCase() === "pixel printers";
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const newPhotos = files.map(f => URL.createObjectURL(f));
            setFormData(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
            toast.success(`${files.length} Photo(s) staged for upload`);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Validation
        if (!formData.name || !formData.mobile || !formData.company || !formData.followUpDate || !formData.address) {
            toast.error("Please fill mandatory fields: Name, Mobile, Company, Address, and Follow-up Date.");
            setIsLoading(false);
            return;
        }

        if (isDuplicate(formData.mobile, formData.company)) {
            toast.error("DUPLICATE DETECTED: A lead with this Mobile or Company already exists. Creation Blocked.");
            setIsLoading(false);
            return;
        }

        // Simulate API/Offline Sync
        const isOffline = !navigator.onLine;

        setTimeout(() => {
            const newLead: Lead = {
                id: `L-${Math.floor(Math.random() * 9000) + 1000}`,
                customerName: formData.name,
                companyName: formData.company,
                mobile: formData.mobile,
                email: formData.email,
                address: formData.address,
                status: 'new',
                source: formData.source,
                productInterest: formData.interests,
                notes: formData.notes,
                followUpDate: formData.followUpDate,
                createdAt: new Date().toISOString(),
                lastActivity: "Created",
                photos: formData.photos
            };

            onLeadCreate(newLead);

            if (isOffline) {
                toast.success("Offline Mode: Lead saved locally. Will sync when network returns.");
            } else {
                toast.success("Lead created successfully and synced to server.");
            }

            setOpen(false);
            setIsLoading(false);
            // Reset
            setFormData({
                name: "", company: "", mobile: "", email: "", source: "website",
                interests: [], address: "", notes: "", followUpDate: "", photos: []
            });
        }, 1200);
    };

    const toggleInterest = (product: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(product)
                ? prev.interests.filter(i => i !== product)
                : [...prev.interests, product]
        }));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg">
                    <Icons.add className="mr-2 h-4 w-4" />
                    Create New Lead
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">New Customer Discovery</DialogTitle>
                    <DialogDescription>
                        All fields marked * are mandatory for field sales compliance.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Customer Name *</Label>
                            <Input id="name" placeholder="Full name of person" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">Company Name *</Label>
                            <div className="relative">
                                <Input id="company" placeholder="Business / Firm Name" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                                {formData.company.toLowerCase() === "pixel printers" && (
                                    <p className="text-[10px] text-red-500 font-bold mt-1 animate-bounce">⚠️ Warning: Match found in archive!</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="mobile">Mobile Number *</Label>
                            <div className="relative">
                                <Input id="mobile" placeholder="10-digit mobile" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} />
                                {formData.mobile.length === 10 && !isDuplicate(formData.mobile, "") && (
                                    <div className="absolute right-2 top-2.5 flex items-center gap-1 text-[10px] text-green-600 font-bold bg-green-50 px-1 rounded">
                                        <Icons.check className="h-3 w-3" /> VERIFIED UNIQUE
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="customer@domain.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Site Address *</Label>
                        <Textarea id="address" placeholder="Full site location for Geo-fencing setup" rows={2} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Lead Source *</Label>
                            <Select value={formData.source} onValueChange={(v: LeadSource) => setFormData({ ...formData, source: v })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="website">Website Inbound</SelectItem>
                                    <SelectItem value="referral">Customer Referral</SelectItem>
                                    <SelectItem value="walk-in">Field Walk-in / Cold</SelectItem>
                                    <SelectItem value="exhibition">Exhibition / Media</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="followUp">Mandatory Follow-up Date *</Label>
                            <Input id="followUp" type="date" value={formData.followUpDate} onChange={e => setFormData({ ...formData, followUpDate: e.target.value })} />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Product Interest (Multi-select)</Label>
                        <div className="flex flex-wrap gap-2">
                            {MACHINES.map(m => (
                                <Badge
                                    key={m}
                                    variant={formData.interests.includes(m) ? "default" : "outline"}
                                    className="cursor-pointer py-1.5 px-3 transition-colors"
                                    onClick={() => toggleInterest(m)}
                                >
                                    {m}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Initial Notes & Requirements</Label>
                        <Textarea placeholder="Budget range, urgency, machine configuration notes..." rows={3} value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                    </div>

                    <div className="space-y-3">
                        <Label>Site Photos (Optional)</Label>
                        <div className="flex flex-wrap gap-3">
                            {formData.photos.map((p, i) => (
                                <div key={i} className="h-16 w-16 rounded border bg-slate-100 overflow-hidden relative group">
                                    <img src={p} className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, idx) => idx !== i) }))}
                                        className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Icons.delete className="h-4 w-4 text-white" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="h-16 w-16 rounded border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:bg-slate-50 transition-colors"
                            >
                                <Icons.add className="h-4 w-4" />
                                <span className="text-[10px]">Attach</span>
                            </button>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handlePhotoUpload}
                            />
                        </div>
                    </div>

                    <DialogFooter className="sticky bottom-0 bg-white pt-4 pb-2">
                        <Button variant="outline" type="button" onClick={() => setOpen(false)}>Discard</Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                            {isLoading ? "Syncing..." : "Finalize & Save Lead"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
