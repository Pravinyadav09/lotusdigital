"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icons } from "@/components/icons";
import { toast } from "sonner";

export function ScheduleVisitDialog({ leadName, leadLocation }: { leadName?: string; leadLocation?: string }) {
    const [open, setOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.promise(new Promise(r => setTimeout(r, 1000)), {
            loading: 'Scheduling field visit...',
            success: 'Visit scheduled! Added to Rep\'s daily task list.',
            error: 'Failed to schedule'
        });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Icons.location className="mr-2 h-4 w-4" />
                    Schedule Visit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Schedule Field Visit</DialogTitle>
                    <DialogDescription>
                        Assign a sales or service engineer to visit the client site.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label>Customer / Site Name</Label>
                        <Input defaultValue={leadName} placeholder="Enter client name" required />
                    </div>

                    <div className="grid gap-2">
                        <Label>Site Address (Location)</Label>
                        <Input defaultValue={leadLocation} placeholder="Okhla, New Delhi, etc." required />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Date</Label>
                            <Input type="date" required />
                        </div>
                        <div className="grid gap-2">
                            <Label>Time Slot</Label>
                            <Select defaultValue="10:00 AM">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10:00 AM">10:00 AM (Morning)</SelectItem>
                                    <SelectItem value="02:00 PM">02:00 PM (Afternoon)</SelectItem>
                                    <SelectItem value="05:00 PM">05:00 PM (Evening)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Assign Field Executive</Label>
                        <Select required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select representative" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="r1">Rahul Singh (Sales)</SelectItem>
                                <SelectItem value="r2">Amit Kumar (Service)</SelectItem>
                                <SelectItem value="r3">Neha Sharma (Sales)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Visit Objective</Label>
                        <Select required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select purpose" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="demo">Product Demo</SelectItem>
                                <SelectItem value="neg">Negotiation / Closure</SelectItem>
                                <SelectItem value="service">Routine Maintenance</SelectItem>
                                <SelectItem value="coll">Payment Collection</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-xs font-bold text-blue-900">GPS Geo-verification</Label>
                            <p className="text-[10px] text-blue-700">Enforce check-in within site radius.</p>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Set Visit Schedule</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
