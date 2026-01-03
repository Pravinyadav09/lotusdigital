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
import { ScheduleVisitDialog } from "@/components/visits/schedule-visit-dialog";
import { LeadKanban } from "@/components/leads/lead-kanban";

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
    const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

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
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl md:text-3xl xl:text-4xl font-bold tracking-tight">Leads & Sales</h2>
                <div className="flex items-center gap-2">
                    <div className="flex border rounded-lg p-0.5 bg-muted">
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            className="h-8 text-xs px-3"
                            onClick={() => setViewMode("list")}
                        >
                            <Icons.menu className="mr-1.5 h-3 w-3" />
                            List
                        </Button>
                        <Button
                            variant={viewMode === "kanban" ? "default" : "ghost"}
                            size="sm"
                            className="h-8 text-xs px-3"
                            onClick={() => setViewMode("kanban")}
                        >
                            <Icons.view className="mr-1.5 h-3 w-3" />
                            Kanban
                        </Button>
                    </div>
                    <CreateLeadDialog onLeadCreate={handleLeadCreate} />
                </div>
            </div>

            <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-4">
                <div className="relative flex-1 max-w-2xl">
                    <Icons.search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search leads by name, company, or interest..."
                        className="pl-10 h-10 lg:h-11 shadow-sm border-slate-200 focus-visible:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-10 lg:h-11 px-4 gap-2 border-slate-200 hover:bg-slate-50 transition-all font-medium text-slate-700" onClick={() => toast.info("Column visibility settings opened.")}>
                        <Icons.settings className="h-4 w-4" />
                        <span>Filter Columns</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-10 lg:h-11 px-4 gap-2 border-slate-200 hover:bg-slate-50 transition-all font-medium text-slate-700" onClick={() => toast.info("Exporting to CSV...")}>
                        <Icons.reports className="h-4 w-4" />
                        <span>Export CSV</span>
                    </Button>
                </div>
            </div>

            {viewMode === "kanban" ? (
                <LeadKanban />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>All Leads</CardTitle>
                        <CardDescription>Manage your prospective customers.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30 hover:bg-muted/30 border-b-2">
                                        <TableHead className="w-[70px] font-bold">ID</TableHead>
                                        <TableHead className="min-w-[180px] font-bold">Customer Details</TableHead>
                                        <TableHead className="min-w-[100px] font-bold">Stage</TableHead>
                                        <TableHead className="min-w-[150px] font-bold">Product Interests</TableHead>
                                        <TableHead className="min-w-[120px] font-bold">Date</TableHead>
                                        <TableHead className="text-right min-w-[140px] font-bold">Actions</TableHead>
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
                                                        <Icons.location className="h-4 w-4 sm:mr-1.5 sm:h-3 sm:w-3" />
                                                        <span className="hidden sm:inline">Check-in</span>
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
                                                            <div className="px-2 py-1">
                                                                <ScheduleVisitDialog leadName={lead.companyName} />
                                                            </div>
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
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
