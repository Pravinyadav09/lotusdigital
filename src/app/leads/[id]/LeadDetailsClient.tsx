"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";

interface LeadDetailsProps {
    id: string;
}

// Mock data
const MOCK_LEAD = {
    id: "L-101",
    customerName: "Rajesh Kumar",
    companyName: "Pixel Printers",
    mobile: "+91 9876543210",
    email: "rajesh@pixelprints.com",
    address: "Shop 12, Nehru Place, New Delhi - 110019",
    status: "qualified",
    productInterest: ["Konica 512i", "UV Flatbed"],
    source: "website",
    assignedTo: "Sales Rep - Rahul",
    createdAt: "2024-05-01",
    lastActivity: "2h ago",
    notes: "Interested in 3.2m machine for flex printing. Budget: 8-10L",
    followUpDate: "2024-05-15",
    photos: [
        "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=200&h=200&fit=crop"
    ]
};

const ACTIVITIES = [
    { id: 1, type: "visit", date: "2024-05-10", user: "Rahul Sales", note: "Site visit completed. Confirmed space availability.", gps: "28.5494,77.2501" },
    { id: 2, type: "call", date: "2024-05-08", user: "Sales Manager", note: "Follow-up call. Discussed pricing options." },
    { id: 3, type: "note", date: "2024-05-05", user: "Rahul Sales", note: "Initial contact. Very interested in Konica series." },
];

const SCORING_DATA = {
    machineInterest: 85, // Scale 0-100
    businessVintage: 12, // Years
    urgency: "Immediate", // Immediate, 1 Month, Exploration
    calcScore: (interest: number, vintage: number, urgency: string) => {
        const uScore = urgency === "Immediate" ? 100 : urgency === "1 Month" ? 60 : 20;
        const vScore = Math.min(vintage * 5, 100); // Max score for 20+ years
        return Math.round((interest * 0.4) + (vScore * 0.3) + (uScore * 0.3));
    }
};

const QUOTES = [
    { id: "Q-2024-045", version: 1, amount: 850000, status: "pending_approval", date: "2024-05-12" },
    { id: "Q-2024-032", version: 1, amount: 920000, status: "rejected", date: "2024-05-08" },
];

export function LeadDetailsClient({ id }: LeadDetailsProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [lead, setLead] = useState(MOCK_LEAD);
    const [activities, setActivities] = useState(ACTIVITIES);
    const [isEditing, setIsEditing] = useState(false);
    const [newNote, setNewNote] = useState("");

    const handleSave = () => {
        toast.success("Lead updated successfully");
        setIsEditing(false);
    };

    const handleAddNote = () => {
        if (!newNote.trim()) return;
        const newAct = {
            id: activities.length + 1,
            type: "note" as const,
            date: new Date().toISOString().split('T')[0],
            user: user?.name || "System",
            note: newNote
        };
        setActivities([newAct, ...activities]);
        toast.success("Note added to timeline");
        setNewNote("");
    };

    const handleStatusChange = (newStatus: string) => {
        setLead(prev => ({ ...prev, status: newStatus }));
        const log = {
            id: activities.length + 1,
            type: "note" as const,
            date: new Date().toISOString().split('T')[0],
            user: user?.name || "System",
            note: `Status updated to ${newStatus.toUpperCase()}`
        };
        setActivities([log, ...activities]);
        toast.success(`Pipeline moved to ${newStatus.toUpperCase()}`);
    };

    const handlePlanVisit = () => {
        router.push(`/leads/${id}/visit`);
    };

    const handleCreateQuote = () => {
        toast.info("Opening Quote Engine for " + lead.customerName);
        router.push(`/quotes/create?leadId=${id}`);
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            new: "bg-blue-500",
            contacted: "bg-cyan-500",
            qualified: "bg-green-500",
            proposal: "bg-amber-500",
            negotiation: "bg-orange-500",
            closed: "bg-gray-500"
        };
        return colors[status] || "bg-gray-500";
    };

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 h-full overflow-y-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.back()}>
                        <Icons.arrowRight className="h-5 w-5 rotate-180" />
                    </Button>
                    <div>
                        <h2 className="text-xl md:text-3xl font-bold tracking-tight">{lead.customerName}</h2>
                        <p className="text-xs md:text-sm text-muted-foreground">{lead.companyName} • {lead.id}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={handlePlanVisit}>
                        <Icons.location className="mr-2 h-4 w-4" />
                        Plan Visit
                    </Button>
                    <Button size="sm" className="flex-1 sm:flex-none" onClick={handleCreateQuote}>
                        <Icons.quotes className="mr-2 h-4 w-4" />
                        Create Quote
                    </Button>
                </div>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 xl:gap-8">
                <Card className="md:col-span-1 border-blue-200 bg-blue-50/10">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Conversion Confidence</p>
                            <div className="relative h-24 w-24">
                                <svg className="h-full w-full" viewBox="0 0 100 100">
                                    <circle className="text-slate-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                                    <circle className="text-blue-600 transition-all duration-1000" strokeWidth="10" strokeDasharray={`${SCORING_DATA.calcScore(85, 12, "Immediate") * 2.51}, 251`} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">
                                    {SCORING_DATA.calcScore(85, 12, "Immediate")}%
                                </div>
                            </div>
                            <Badge className="mt-2 bg-blue-600">HIGH PROBABILITY</Badge>
                        </div>
                    </CardContent>
                </Card>
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                    <div className="p-4 border rounded-lg bg-white shadow-sm flex flex-col justify-center">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Machine Interest</p>
                        <p className="text-lg font-bold">85/100</p>
                        <p className="text-[10px] text-muted-foreground mt-1 text-blue-600">High-end Production Units</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-white shadow-sm flex flex-col justify-center">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Business Vintage</p>
                        <p className="text-lg font-bold">12 Years</p>
                        <p className="text-[10px] text-muted-foreground mt-1 text-green-600 font-bold">Established Player</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-white shadow-sm flex flex-col justify-center">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Requirement Urgency</p>
                        <p className="text-lg font-bold">Immediate</p>
                        <p className="text-[10px] text-muted-foreground mt-1 text-orange-600 font-bold">Closure within 7 days</p>
                    </div>
                </div>
            </div>

            {/* Status Badge */}
            <Select value={lead.status} onValueChange={handleStatusChange}>
                <SelectTrigger className={`w-[180px] text-white font-bold border-none h-8 ${getStatusColor(lead.status)}`}>
                    <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="new">NEW</SelectItem>
                    <SelectItem value="contacted">CONTACTED</SelectItem>
                    <SelectItem value="qualified">QUALIFIED</SelectItem>
                    <SelectItem value="proposal">PROPOSAL</SelectItem>
                    <SelectItem value="negotiation">NEGOTIATION</SelectItem>
                    <SelectItem value="closed">CLOSED</SelectItem>
                </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">Last activity: {lead.lastActivity}</span>

            {/* Tabs */}
            <Tabs defaultValue="details" className="space-y-4">
                <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-muted/20">
                    <TabsTrigger value="details" className="flex-1 sm:flex-none">Details</TabsTrigger>
                    <TabsTrigger value="activities" className="flex-1 sm:flex-none">
                        Activities
                        <Badge variant="secondary" className="ml-1.5 sm:ml-2 text-[10px] px-1">{activities.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="quotes" className="flex-1 sm:flex-none">
                        Quotes
                        <Badge variant="secondary" className="ml-1.5 sm:ml-2 text-[10px] px-1">{QUOTES.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="flex-1 sm:flex-none">
                        Docs & Photos
                    </TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Lead Information</CardTitle>
                            <Button
                                variant={isEditing ? "default" : "outline"}
                                size="sm"
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            >
                                {isEditing ? "Save" : "Edit"}
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Customer Name</Label>
                                    <Input value={lead.customerName} disabled={!isEditing} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Company Name</Label>
                                    <Input value={lead.companyName} disabled={!isEditing} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Mobile</Label>
                                    <Input value={lead.mobile} disabled={!isEditing} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input value={lead.email} disabled={!isEditing} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Address</Label>
                                <Textarea value={lead.address} disabled={!isEditing} rows={2} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Lead Source</Label>
                                    <Input value={lead.source} disabled={!isEditing} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Assigned To (Manager Only)</Label>
                                    {(user?.role === 'super_admin' || user?.role === 'sales_manager') ? (
                                        <Select
                                            defaultValue="r1"
                                            onValueChange={(v) => {
                                                const names: Record<string, string> = {
                                                    'r1': 'Vikram Singh (Sr Rep)',
                                                    'r2': 'Amit Kumar (Field Sales)',
                                                    'r3': 'Neha Sharma (Inside Sales)'
                                                };
                                                setLead(prev => ({ ...prev, assignedTo: names[v] }));
                                                toast.success(`Lead reassigned to ${names[v]}`);
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="r1">Vikram Singh (Sr Rep)</SelectItem>
                                                <SelectItem value="r2">Amit Kumar (Field Sales)</SelectItem>
                                                <SelectItem value="r3">Neha Sharma (Inside Sales)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input value={lead.assignedTo} disabled />
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Product Interest</Label>
                                <div className="flex gap-2">
                                    {lead.productInterest.map((product, i) => (
                                        <Badge key={i} variant="outline">{product}</Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Notes</Label>
                                <Textarea value={lead.notes} disabled={!isEditing} rows={3} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Activities Tab */}
                <TabsContent value="activities" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add Activity Note</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                placeholder="Enter activity note..."
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                rows={3}
                            />
                            <Button onClick={handleAddNote}>
                                <Icons.add className="mr-2 h-4 w-4" />
                                Add Note
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {activities.map((activity) => (
                                    <div key={activity.id} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`rounded-full p-2 ${activity.type === 'visit' ? 'bg-green-100' :
                                                activity.type === 'call' ? 'bg-blue-100' : 'bg-gray-100'
                                                }`}>
                                                {activity.type === 'visit' ? <Icons.location className="h-4 w-4 text-green-600" /> :
                                                    activity.type === 'call' ? <Icons.bell className="h-4 w-4 text-blue-600" /> :
                                                        <Icons.check className="h-4 w-4 text-gray-600" />}
                                            </div>
                                            {activity.id !== ACTIVITIES[ACTIVITIES.length - 1].id && (
                                                <div className="w-0.5 h-full bg-border mt-2" />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-6">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium capitalize">{activity.type}</span>
                                                <span className="text-sm text-muted-foreground">{activity.date}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-1">{activity.user}</p>
                                            <p className="text-sm">{activity.note}</p>
                                            {activity.gps && (
                                                <Badge variant="outline" className="mt-2">
                                                    <Icons.location className="mr-1 h-3 w-3" />
                                                    GPS Verified
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Quotes Tab */}
                <TabsContent value="quotes" className="space-y-4">
                    {QUOTES.map((quote) => (
                        <Card key={quote.id}>
                            {/* ... existing code ... */}
                        </Card>
                    ))}
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents" className="space-y-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle>Site & Verification Media</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {lead.photos?.map((url, i) => (
                                    <div key={i} className="aspect-square rounded-lg border overflow-hidden bg-slate-50 relative group">
                                        <img src={url} className="h-full w-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button variant="ghost" size="sm" className="text-white h-8 w-8 p-0"><Icons.view className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                ))}
                                <button className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:bg-slate-50">
                                    <Icons.add className="h-5 w-5 mb-1" />
                                    <span className="text-[10px]">Add Photo</span>
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle>Compliance Documents</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {[
                                { name: "GST Certificate.pdf", size: "1.2 MB" },
                                { name: "Company_PAN.jpg", size: "450 KB" }
                            ].map((doc, i) => (
                                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded bg-blue-50 flex items-center justify-center">
                                            <Icons.reports className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{doc.name}</p>
                                            <p className="text-[10px] text-muted-foreground">{doc.size}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground"><Icons.view className="h-4 w-4" /></Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
