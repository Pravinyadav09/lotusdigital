"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// Mock Data
const TICKET = {
    id: "SR-501",
    customer: "Singh Graphics",
    machineId: "KONICA-512-004",
    issue: "Printhead Clogging - Magenta",
    description: "Magenta head not firing properly even after purge. Nozzle test shows 40% blockage.",
    priority: "high",
    status: "assigned", // open, assigned, in_progress, closed
    engineer: "Amit Service",
    createdDate: "2024-05-02",
    isMachineLocked: false, // Set to true to test lock
};

const UPDATE_LOGS = [
    { id: 1, date: "2024-05-02 10:30", user: "Customer", action: "Ticket Created" },
    { id: 2, date: "2024-05-02 11:15", user: "Admin", action: "Assigned to Amit Service" },
];

export default function ServiceTicketPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { user } = useAuth();
    const [ticket, setTicket] = useState(TICKET);
    const [status, setStatus] = useState(ticket.status);
    const [newUpdate, setNewUpdate] = useState("");

    const handleStatusChange = (newStatus: string) => {
        // Financial Lock Check
        if (newStatus === "closed" && ticket.isMachineLocked) {
            toast.error("Cannot close ticket! Machine is financially locked due to overdue payment.");
            return;
        }

        setStatus(newStatus);
        toast.success(`Status updated to ${newStatus.replace("_", " ").toUpperCase()}`);
    };

    const handleAddUpdate = () => {
        if (!newUpdate) return;
        toast.success("Update added to log");
        setNewUpdate("");
    };

    const isEngineer = user?.role === "service_engineer";
    const isAdmin = user?.role === "super_admin" || user?.role === "sales_manager";

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 h-full overflow-y-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <Icons.arrowRight className="h-5 w-5 rotate-180" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{ticket.id}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span>{ticket.customer}</span>
                        <span>•</span>
                        <span>{ticket.machineId}</span>
                    </div>
                </div>
                <div className="ml-auto flex gap-2">
                    {ticket.isMachineLocked && (
                        <Badge variant="destructive" className="animate-pulse">
                            <Icons.warning className="mr-1 h-3 w-3" />
                            MACHINE LOCKED
                        </Badge>
                    )}
                    <Badge variant={ticket.priority === "high" ? "destructive" : "default"}>
                        {ticket.priority.toUpperCase()} Priority
                    </Badge>
                    <Badge variant="outline" className="bg-primary/5">
                        {status.toUpperCase().replace("_", " ")}
                    </Badge>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                {/* Main Content */}
                <div className="md:col-span-5 space-y-6">
                    {/* Contact & Navigation Bar */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <Button variant="outline" className="flex-1 bg-green-50 text-green-700 border-green-200">
                            <Icons.phone className="mr-2 h-4 w-4" />
                            Call Customer
                        </Button>
                        <Button variant="outline" className="flex-1 bg-green-50 text-green-700 border-green-200">
                            <Icons.message className="mr-2 h-4 w-4" />
                            WhatsApp
                        </Button>
                        <Button variant="default" className="flex-1 bg-blue-600">
                            <Icons.location className="mr-2 h-4 w-4" />
                            Navigate (Google Maps)
                        </Button>
                    </div>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Issue Overview</CardTitle>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-4 space-y-4">
                            <div>
                                <Label className="text-muted-foreground">Machine Details</Label>
                                <p className="text-sm font-semibold">{ticket.machineId} (KONICA-MINOLTA C3070)</p>
                                <p className="text-xs text-muted-foreground mt-1">Warranty Status: <span className="text-green-600 font-bold">ACTIVE (Till Dec 2024)</span></p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Reported Problem</Label>
                                <p className="text-sm font-medium border-l-4 border-red-500 pl-3 py-1 bg-red-50/50">{ticket.issue}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Detailed Description</Label>
                                <p className="text-sm text-muted-foreground">{ticket.description}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Resolution & Work Performed</CardTitle>
                            <CardDescription>Describe how the issue was fixed. Required to close ticket.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="resolution">Resolution Detail</Label>
                                <Textarea
                                    id="resolution"
                                    placeholder="e.g. Cleaned corona wire, replaced secondary transfer roller..."
                                    className="min-h-[100px]"
                                    defaultValue={status === 'closed' ? "Cleaned the magenta head with specialized solution and performed 3 hard flushes. Nozzle test now 100%." : ""}
                                    readOnly={status === 'closed'}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Parts Used (Optional)</Label>
                                <Input placeholder="e.g. Roller Kit (A03U-3301)" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Service Photos (Before/After)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="aspect-square bg-muted rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                                    <Icons.add className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div className="aspect-square bg-slate-200 rounded-lg flex items-center justify-center text-[10px] text-muted-foreground font-bold uppercase">Before photo</div>
                                <div className="aspect-square bg-slate-200 rounded-lg flex items-center justify-center text-[10px] text-muted-foreground font-bold uppercase">After photo</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Log & Updates</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <Textarea
                                        placeholder="Add a field note..."
                                        value={newUpdate}
                                        onChange={(e) => setNewUpdate(e.target.value)}
                                    />
                                </div>
                                <Button onClick={handleAddUpdate} disabled={!newUpdate} size="sm">Post Note</Button>
                            </div>

                            <div className="space-y-4">
                                {UPDATE_LOGS.map(log => (
                                    <div key={log.id} className="flex gap-4 p-4 border rounded-lg bg-muted/20">
                                        <div className="bg-background p-2 rounded-full border shadow-sm h-fit">
                                            <Icons.check className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{log.action}</p>
                                            <p className="text-[10px] text-muted-foreground">{log.user} • {log.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Actions */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Customer Location</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="h-[120px] w-full bg-slate-100 rounded-md border overflow-hidden relative group">
                                <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=28.4595,77.0266&zoom=14&size=300x150')] bg-cover" />
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                                <div className="absolute bottom-2 right-2">
                                    <Button size="icon" className="h-8 w-8 rounded-full shadow-lg" onClick={() => window.open('https://maps.google.com/?q=28.4595,77.0266')}>
                                        <Icons.location className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="text-xs">
                                <p className="font-semibold">Singh Graphics & Solutions</p>
                                <p className="text-muted-foreground">Okhla Industrial Area, Phase III, New Delhi</p>
                            </div>
                        </CardContent>
                    </Card>

                    {isAdmin && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Admin Controls</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs">Re-assign Ticket</Label>
                                    <Select defaultValue={ticket.engineer}>
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Amit Service">Amit Service</SelectItem>
                                            <SelectItem value="Rahul Service">Rahul Service</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card className={status === 'closed' ? 'bg-muted/30' : 'border-blue-200 bg-blue-50/20'}>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Execution Controls</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {status === "assigned" && (
                                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handleStatusChange("in_progress")}>
                                    <Icons.play className="mr-2 h-4 w-4" />
                                    Start Progress
                                </Button>
                            )}
                            {status === "in_progress" && (
                                <Button
                                    className="w-full bg-green-600 hover:bg-green-700"
                                    onClick={() => handleStatusChange("closed")}
                                    disabled={ticket.isMachineLocked}
                                >
                                    <Icons.check className="mr-2 h-4 w-4" />
                                    Close Call
                                </Button>
                            )}
                            {status === "closed" && (
                                <Button variant="outline" className="w-full bg-background" disabled>
                                    <Icons.check className="mr-2 h-4 w-4 text-green-600" />
                                    Resolved
                                </Button>
                            )}

                            {ticket.isMachineLocked && (
                                <div className="p-3 bg-red-100 border border-red-200 rounded-md">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Icons.warning className="h-3 w-3 text-red-600" />
                                        <span className="text-[10px] font-bold text-red-700 uppercase tracking-tighter">Machine Locked</span>
                                    </div>
                                    <p className="text-[10px] text-red-600 leading-tight">
                                        Cannot close call until payment is cleared by Finance.
                                    </p>
                                </div>
                            )}

                            <Separator />
                            <div className="pt-1">
                                <p className="text-[10px] text-muted-foreground mb-2 font-semibold uppercase tracking-wider">Field Quick Notes</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {[
                                        { label: "Site Reached", color: "bg-blue-50 text-blue-700 border-blue-200" },
                                        { label: "Diagnosis Done", color: "bg-purple-50 text-purple-700 border-purple-200" },
                                        { label: "Head Cleaned", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
                                        { label: "Test Print OK", color: "bg-green-50 text-green-700 border-green-200" },
                                        { label: "Awaiting Part", color: "bg-amber-50 text-amber-700 border-amber-200" },
                                        { label: "Customer Not Available", color: "bg-red-50 text-red-700 border-red-200" },
                                        { label: "Spares Quoted", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
                                    ].map((note) => (
                                        <Badge
                                            key={note.label}
                                            variant="outline"
                                            className={`text-[10px] cursor-pointer hover:shadow-sm transition-all h-6 ${note.color}`}
                                            onClick={() => {
                                                setNewUpdate(note.label);
                                                toast.info(`Note set: ${note.label}. Click 'Post Note' to save.`);
                                            }}
                                        >
                                            {note.label}
                                        </Badge>
                                    ))}
                                </div>
                                <p className="text-[9px] text-muted-foreground mt-2 italic">* Tapping a badge pre-fills the note box.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
