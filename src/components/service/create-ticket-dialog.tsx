"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icons } from "@/components/icons";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";

export function CreateTicketDialog() {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [ticket, setTicket] = useState({
        machineId: "",
        customer: user?.role === 'customer' ? user.name : "",
        issue: "",
        priority: "normal",
        issueType: "breakdown"
    });

    const isCustomer = user?.role === 'customer';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (ticket.machineId === "LOCKED-123" || ticket.machineId === "sn-2023-b5") {
            toast.error("Machine is Financially Locked. Service cannot be created until payment is cleared.");
            setIsLoading(false);
            return;
        }

        setTimeout(() => {
            toast.success("Service Ticket Created Successfully. Our engineer will contact you shortly.");
            setOpen(false);
            setIsLoading(false);
            setTicket({ ...ticket, machineId: "", issue: "", priority: "normal" });
        }, 1000);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Icons.add className="mr-2 h-4 w-4" />
                    {isCustomer ? "Raise Service Request" : "New Ticket"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isCustomer ? "New Service Request" : "Create Service Ticket"}</DialogTitle>
                    <DialogDescription>
                        {isCustomer ? "Tell us what's wrong with your machine." : "Log a new support request for a customer."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="cust">Customer Name</Label>
                        <Input
                            id="cust"
                            value={ticket.customer}
                            onChange={(e) => setTicket({ ...ticket, customer: e.target.value })}
                            placeholder="Search customer..."
                            readOnly={isCustomer}
                            className={isCustomer ? "bg-muted" : ""}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="mid">Select Machine</Label>
                        {isCustomer ? (
                            <Select onValueChange={(v) => setTicket({ ...ticket, machineId: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chose your machine" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sn-2024-x1">LP-5000 Max (S/N: 2024-X1)</SelectItem>
                                    <SelectItem value="sn-2023-b5">LP-2000 Mini (S/N: 2023-B5) - LOCKED</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <Input
                                id="mid"
                                value={ticket.machineId}
                                onChange={(e) => setTicket({ ...ticket, machineId: e.target.value })}
                                placeholder="e.g. LDS-2024-005"
                            />
                        )}
                        {!isCustomer && <p className="text-[10px] text-muted-foreground">Try "LOCKED-123" to test locking validation.</p>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Issue Type</Label>
                            <Select onValueChange={(v) => setTicket({ ...ticket, issueType: v })} defaultValue="breakdown">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="breakdown">Breakdown</SelectItem>
                                    <SelectItem value="installation">Installation</SelectItem>
                                    <SelectItem value="training">Training</SelectItem>
                                    <SelectItem value="maintenance">AMC/Maintenance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Priority</Label>
                            <Select onValueChange={(v) => setTicket({ ...ticket, priority: v })} defaultValue="normal">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="critical">Critical (Down)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="issue">Issue Description</Label>
                        <Textarea
                            id="issue"
                            value={ticket.issue}
                            onChange={(e) => setTicket({ ...ticket, issue: e.target.value })}
                            placeholder="Describe the problem in detail..."
                            className="min-h-[80px]"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Attach Photos (Optional)</Label>
                        <div className="flex items-center justify-center w-full h-20 border-2 border-dashed rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
                            <div className="text-center">
                                <Icons.add className="mx-auto h-4 w-4 text-muted-foreground" />
                                <span className="text-[10px] text-muted-foreground">Click to upload photos</span>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>{isLoading ? "Submitting..." : (isCustomer ? "Submit Request" : "Create Ticket")}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
