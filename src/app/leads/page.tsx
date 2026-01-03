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
import { useGeofence } from "@/providers/geofence-provider";
import dynamic from "next/dynamic";

const OSMMap = dynamic(() => import("@/components/maps/osm-map"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-lg flex items-center justify-center">Loading Field Map...</div>
});

// Mock Data
const MOCK_LEADS: Lead[] = [
    {
        id: "L-101",
        customerName: "Rajesh Kumar",
        companyName: "Pixel Printers",
        mobile: "9876543210",
        address: "Okhla Phase 3, New Delhi",
        source: "website",
        status: "new",
        productInterest: ["Konica 512i"],
        followUpDate: "2024-05-15",
        createdAt: "2024-05-01",
        lastActivity: "2h ago"
    },
    {
        id: "L-102",
        customerName: "Anita Desmond",
        companyName: "Desmond Digitals",
        mobile: "9898989898",
        address: "Kothrud, Pune",
        source: "referral",
        status: "qualified",
        productInterest: ["Laser Cutter 4x8"],
        followUpDate: "2024-05-12",
        createdAt: "2024-04-28",
        lastActivity: "1d ago"
    },
    {
        id: "L-103",
        customerName: "Vikram Singh",
        companyName: "Singh Graphics",
        mobile: "7654321098",
        address: "Sector 62, Noida",
        source: "walk-in",
        status: "negotiation",
        productInterest: ["UV Flatbed"],
        followUpDate: "2024-05-20",
        createdAt: "2024-04-15",
        lastActivity: "5h ago"
    },
    {
        id: "L-104",
        customerName: "Sohan Lal",
        companyName: "Rapid Press",
        mobile: "9988776655",
        address: "Manesar, Gurgaon",
        source: "exhibition",
        status: "demo_scheduled",
        productInterest: ["Ricoh Pro C7200"],
        followUpDate: "2024-05-10",
        createdAt: "2024-04-25",
        lastActivity: "3h ago"
    },
    {
        id: "L-105",
        customerName: "Priya Sharma",
        companyName: "Global Colors",
        mobile: "9123456780",
        address: "Connaught Place, Delhi",
        source: "website",
        status: "new",
        productInterest: ["Heavy Duty Cutter"],
        followUpDate: "2024-05-18",
        createdAt: "2024-05-05",
        lastActivity: "10m ago"
    },
    {
        id: "L-106",
        customerName: "Amitabh Verma",
        companyName: "Zenith Press",
        mobile: "8899001122",
        address: "Andheri East, Mumbai",
        source: "cold_call",
        status: "won",
        productInterest: ["Konica C4080"],
        followUpDate: "2024-05-01",
        createdAt: "2024-03-20",
        lastActivity: "2d ago"
    },
    {
        id: "L-107",
        customerName: "Deepak Chopra",
        companyName: "Print Hub",
        mobile: "7766554433",
        address: "Chandigarh Ind. Area",
        source: "referral",
        status: "lost",
        productInterest: ["Eco Solvent Printer"],
        followUpDate: "2024-06-01",
        createdAt: "2024-02-10",
        lastActivity: "1w ago"
    },
    {
        id: "L-108",
        customerName: "Neha Gupta",
        companyName: "Alpha Prints",
        mobile: "9911223344",
        address: "Jaipur, Rajasthan",
        source: "social_media",
        status: "qualified",
        productInterest: ["Binding Machine"],
        followUpDate: "2024-05-14",
        createdAt: "2024-04-30",
        lastActivity: "4h ago"
    },
    {
        id: "L-109",
        customerName: "Karan Johar",
        companyName: "Tech Print",
        mobile: "9876500000",
        address: "Bangalore, KA",
        source: "website",
        status: "demo_scheduled",
        productInterest: ["3D Printer XL"],
        followUpDate: "2024-05-22",
        createdAt: "2024-05-02",
        lastActivity: "30m ago"
    }
];

export default function LeadsPage() {
    const { verifyLocation, logVisit } = useGeofence();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
    const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
    const [showMap, setShowMap] = useState(false);

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

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="relative flex-1 group">
                    <Icons.search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                    <Input
                        placeholder="Search leads by name, company or interest..."
                        className="pl-10 h-10 lg:h-11 bg-white border-slate-200 focus-visible:ring-blue-500 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 shrink-0">
                    <Button
                        variant="outline"
                        size="sm"
                        className={`h-10 lg:h-11 px-4 gap-2 border-slate-200 transition-all font-medium shrink-0 ${showMap ? "bg-blue-50 text-blue-700 border-blue-200" : "hover:bg-slate-50 text-slate-700"}`}
                        onClick={() => setShowMap(!showMap)}
                    >
                        <Icons.location className="h-4 w-4" />
                        <span className="hidden sm:inline">{showMap ? "Hide Map" : "Field Map"}</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-10 lg:h-11 px-4 gap-2 border-slate-200 hover:bg-slate-50 transition-all font-medium text-slate-700 shrink-0" onClick={() => toast.info("Column visibility settings opened.")}>
                        <Icons.settings className="h-4 w-4" />
                        <span className="hidden sm:inline">Filters</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-10 lg:h-11 px-4 gap-2 border-slate-200 hover:bg-slate-50 transition-all font-medium text-slate-700 shrink-0" onClick={() => toast.info("Exporting to CSV...")}>
                        <Icons.reports className="h-4 w-4" />
                        <span className="hidden sm:inline">Export</span>
                    </Button>
                </div>
            </div>

            {showMap && (
                <Card className="border-blue-100 shadow-sm overflow-hidden mb-6">
                    <CardHeader className="bg-muted/30 py-3 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xs uppercase tracking-wider font-bold">Leads Geographic Distribution</CardTitle>
                            <CardDescription className="text-[10px]">Real-time field presence & customer site clusters</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 py-0.5 text-[10px]">
                            <div className="h-1.5 w-1.5 bg-green-500 rounded-full mr-2 animate-pulse" />
                            GPS Active
                        </Badge>
                    </CardHeader>
                    <CardContent className="p-0">
                        <OSMMap
                            center={[28.6139, 77.2090]}
                            zoom={10}
                            height="350px"
                            geofences={filteredLeads.map(lead => ({
                                id: lead.id,
                                name: lead.companyName,
                                lat: 28.5 + (Math.random() * 0.2), // Mock lat since lead doesn't have it
                                lng: 77.1 + (Math.random() * 0.2), // Mock lng
                                radius: 500,
                                isActive: true
                            }))}
                        />
                    </CardContent>
                </Card>
            )}

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
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            const promise = verifyLocation(28.5355, 77.2732, 500); // Using mock target
                                                            toast.promise(promise, {
                                                                loading: 'Acquiring GPS Signal...',
                                                                success: (data) => {
                                                                    if (data.success) {
                                                                        logVisit({
                                                                            visitId: lead.id,
                                                                            geofenceId: "MANUAL",
                                                                            timestamp: new Date().toISOString(),
                                                                            status: "verified",
                                                                            distance: data.distance,
                                                                            coordinates: { lat: 28.5355, lng: 77.2732 }
                                                                        });
                                                                        return `Visit Geo-Verified! (Within ${data.distance}m). Log Started.`;
                                                                    } else {
                                                                        throw new Error(`Location Mismatch! You are ${data.distance}m away.`);
                                                                    }
                                                                },
                                                                error: (err) => err.message || 'Location acquisition failed.',
                                                            });
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
                                                            <DropdownMenuItem onClick={() => router.push(`/quotes/create?leadId=${lead.id}`)}>Create Quote</DropdownMenuItem>
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
            )
            }
        </div >
    );
}
