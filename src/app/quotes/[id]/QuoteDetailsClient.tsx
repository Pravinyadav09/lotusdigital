"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";

export function QuoteDetailsClient({ id }: { id: string }) {
    const { user } = useAuth();

    // Mock Data
    const quote = {
        id: id,
        customer: "Pixel Printers",
        date: "2024-05-01",
        status: "approved",
        amount: 850000,
        items: [
            { name: "Lotus X1 (Machine)", type: "Goods", hsn: "8443", price: 650000 },
            { name: "Konica 512i Heads (4x)", type: "Goods", hsn: "8443", price: 120000 },
            { name: "Installation & Training", type: "Service", sac: "9987", price: 30000 },
            { name: "Start-up Ink Kit", type: "Goods", hsn: "3215", price: 50000 },
        ]
    };

    const [quoteStatus, setQuoteStatus] = useState(quote.status);
    const [timeline, setTimeline] = useState([
        { label: "Draft Created", date: "2024-05-01 10:00 AM", done: true },
        { label: "Submitted for Approval", date: "2024-05-01 02:30 PM", done: true },
        { label: "Approved by Manager", date: "2024-05-02 09:15 AM", done: true },
        { label: "Proforma Invoice (PI) Issued", date: "2024-05-02 11:45 AM", done: true },
        { label: "Sales Order (SO) & EMI Tagged", date: "Pending", done: false },
        { label: "Tax Invoice & Machine Dispatch", date: "Pending", done: false },
    ]);

    const handleDownload = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1500)),
            {
                loading: 'Preparing PDF for Export...',
                success: 'Quotation PDF Downloaded Successfully.',
                error: 'Download Failed',
            }
        );
    };

    const handleTagEMI = () => {
        toast.info("Opening Sales Order Configuration...");
        setTimeout(() => {
            setTimeline(prev => prev.map(step =>
                step.label.includes("Sales Order") ? { ...step, done: true, date: new Date().toLocaleString() } : step
            ));
            toast.success("Sales Order SO-2024-001 Created. EMI Schedule Tagged: 6 Months @ ₹1.2L");
        }, 1000);
    };

    const handleReject = () => {
        setQuoteStatus("rejected");
        toast.error("Quotation Rejected. Sales Rep notified for revision.");
    };

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 h-full overflow-y-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{quote.id}</h2>
                        <Badge className={`${quoteStatus === 'approved' ? 'bg-green-600' : quoteStatus === 'rejected' ? 'bg-red-600' : 'bg-blue-600'} text-sm md:text-base px-3 py-1`}>
                            {quoteStatus.toUpperCase()}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">Pixel Printers • Created on {quote.date}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="flex-1 md:flex-none" onClick={handleDownload}>
                        <Icons.logo className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                    <Button className="border-blue-600 text-blue-600 flex-1 md:flex-none" variant="outline" onClick={() => toast.success("Proforma Invoice (PI) generated and sent to customer.")}>
                        <Icons.accounting className="mr-2 h-4 w-4" />
                        Generate PI
                    </Button>
                    {(user?.role === 'super_admin' || user?.role === 'sales_manager') && quoteStatus === 'approved' && (
                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={handleReject}>
                            <Icons.warning className="mr-2 h-4 w-4" />
                            Reject Quote
                        </Button>
                    )}
                    <Button className="bg-blue-600 w-full md:w-auto" onClick={handleTagEMI}>
                        <Icons.check className="mr-2 h-4 w-4" />
                        Tag EMI & Create SO
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    {/* Deal Timeline Tracker */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Deal Timeline Tracker</CardTitle>
                            <CardDescription>Live status of the sales lifecycle</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative border-l-2 border-muted ml-3 space-y-8 pb-2">
                                {timeline.map((step, index) => (
                                    <div key={index} className="relative pl-8">
                                        <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 ${step.done ? "bg-green-500 border-green-500" : "bg-background border-muted"}`} />
                                        <div>
                                            <p className={`text-sm font-medium ${step.done ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                                            <p className="text-xs text-muted-foreground">{step.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Mandatory 3-Section Segmentation (LOCKED POST-APPROVAL) */}
                    <Card className="border-blue-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-blue-50/50">
                            <div>
                                <CardTitle>Sectional Breakup (GST Mapping)</CardTitle>
                                <CardDescription>Supply of Goods vs Services segregation</CardDescription>
                            </div>
                            <Badge variant="outline" className="text-blue-700 border-blue-200 uppercase bg-blue-100/50">
                                <Icons.check className="mr-1 h-3 w-3" /> Version Locked
                            </Badge>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            {/* Section 1: Body */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold uppercase text-slate-500 tracking-wider">
                                    <span>Section 1: Body Billable (Supply of Goods)</span>
                                    <Badge variant="outline" className="text-[10px]">HSN: 8443</Badge>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Lotus X1 Core Chassis & Electronics</span>
                                        <span className="font-medium">₹ 6,50,000</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Konica 512i Printhead Array (4x)</span>
                                        <span className="font-medium">₹ 1,20,000</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold border-t pt-2">
                                        <span>Subtotal (Body)</span>
                                        <span>₹ 7,70,000</span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Services */}
                            <div className="space-y-3 pt-4 border-t border-dashed">
                                <div className="flex justify-between items-center text-xs font-bold uppercase text-slate-500 tracking-wider">
                                    <span>Section 2: Extended Service Clause (Supply of Services)</span>
                                    <Badge variant="outline" className="text-[10px]">SAC: 9987</Badge>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>On-site Installation & Technical Training</span>
                                        <span className="font-medium">₹ 30,000</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold border-t pt-2">
                                        <span>Subtotal (Services)</span>
                                        <span>₹ 30,000</span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Accessories */}
                            <div className="space-y-3 pt-4 border-t border-dashed">
                                <div className="flex justify-between items-center text-xs font-bold uppercase text-slate-500 tracking-wider">
                                    <span>Section 3: Accessories & Consumables (Supply of Goods)</span>
                                    <Badge variant="outline" className="text-[10px]">HSN: 3215</Badge>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Start-up Ink Kit (CMYK + Cleaning)</span>
                                        <span className="font-medium">₹ 50,000</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold border-t pt-2">
                                        <span>Subtotal (Accessories)</span>
                                        <span>₹ 50,000</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t-2">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-bold">Total Quote Amount</p>
                                        <p className="text-[10px] text-muted-foreground italic">Excluding GST (GST calculated at Invoice stage)</p>
                                    </div>
                                    <div className="text-2xl font-black text-blue-600">₹ 8,50,000</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Customer Details</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <p className="font-semibold">Pixel Printers</p>
                            <p className="text-muted-foreground">Mr. Rajesh Kumar</p>
                            <p className="text-muted-foreground">+91 98765 43210</p>
                            <p className="text-muted-foreground">123, Industrial Area, Okhla Phase III, New Delhi</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Version History</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span>v1.0 (Current)</span>
                                <span className="text-muted-foreground">02 May</span>
                            </div>
                            <div className="flex justify-between text-sm opacity-50">
                                <span>v0.9 (Draft)</span>
                                <span className="text-muted-foreground">01 May</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
