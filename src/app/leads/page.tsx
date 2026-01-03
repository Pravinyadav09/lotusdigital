"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Lead } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { CreateLeadDialog } from "@/components/leads/create-lead-dialog";

// Mock Data
const MOCK_LEADS: Lead[] = [
    { id: "L-101", customerName: "Rajesh Kumar", companyName: "Pixel Printers", mobile: "+91 9876543210", status: "new", productInterest: ["Konica 512i"], createdAt: "2024-05-01", lastActivity: "2h ago" },
    { id: "L-102", customerName: "Anita Desmond", companyName: "Desmond Digitals", mobile: "+91 9898989898", status: "qualified", productInterest: ["Laser Cutter 4x8"], createdAt: "2024-04-28", lastActivity: "1d ago" },
    { id: "L-103", customerName: "Vikram Singh", companyName: "Singh Graphics", mobile: "+91 7654321098", status: "negotiation", productInterest: ["UV Flatbed"], createdAt: "2024-04-15", lastActivity: "5h ago" },
];

export default function LeadsPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);

    const filteredLeads = leads.filter(lead =>
        lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLeadCreate = (newLead: Lead) => {
        setLeads([newLead, ...leads]);
    };

    const handleLeadClick = (leadId: string) => {
        router.push(`/leads/${leadId}`);
    };

    const handleArchiveLead = (leadId: string) => {
        setLeads(leads.filter(l => l.id !== leadId));
        toast.warning("Lead archived and moved to inactive bin.");
    };

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Leads & Sales</h2>
                <CreateLeadDialog onLeadCreate={handleLeadCreate} />
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Icons.search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search leads..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" size="icon" onClick={() => toast.info("Column visibility and filter settings opened.")}>
                    <Icons.settings className="h-4 w-4" />
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Leads</CardTitle>
                    <CardDescription>Manage your prospective customers.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Lead ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Interest</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLeads.map((lead) => (
                                <TableRow
                                    key={lead.id}
                                    className="cursor-pointer hover:bg-muted/50"
                                >
                                    <TableCell className="font-medium" onClick={() => handleLeadClick(lead.id)}>{lead.id}</TableCell>
                                    <TableCell onClick={() => handleLeadClick(lead.id)}>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{lead.customerName}</span>
                                            <span className="text-xs text-muted-foreground">{lead.companyName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell onClick={() => handleLeadClick(lead.id)}>
                                        <Badge variant={
                                            lead.status === 'new' ? 'secondary' :
                                                lead.status === 'qualified' ? 'outline' :
                                                    lead.status === 'negotiation' ? 'default' : 'secondary'
                                        }>
                                            {lead.status.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell onClick={() => handleLeadClick(lead.id)}>{lead.productInterest.join(", ")}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toast.promise(
                                                        new Promise((resolve, reject) => {
                                                            setTimeout(() => {
                                                                // Simulating 80% success rate for being within 500m
                                                                Math.random() > 0.2 ? resolve(true) : reject();
                                                            }, 1500);
                                                        }),
                                                        {
                                                            loading: 'Acquiring GPS Signal...',
                                                            success: 'Visit Geo-Verified! (Within 350m of Site). Log Started.',
                                                            error: 'Location Mismatch! You must be within 500m of the site to check-in.',
                                                        }
                                                    );
                                                }}
                                            >
                                                <Icons.location className="mr-1.5 h-3 w-3" />
                                                Check-in
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <Icons.menu className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleLeadClick(lead.id)}>View Details</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => router.push('/quotes/create')}>Create Quote</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleArchiveLead(lead.id)}>Archive Lead</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
