"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCatalog } from "@/providers/catalog-provider";

const WIDTH_COSTS: Record<string, number> = { "3.2m": 0, "5m": 250000, "1.8m": 0, "2.5m": 120000 };

function CreateQuoteContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { machines, heads, accessories: catalogAccessories } = useCatalog();
    const [step, setStep] = useState(1);

    // Config State
    const [config, setConfig] = useState({
        leadId: searchParams.get("leadId") || "",
        model: machines[0]?.name || "Lotus Max 5000",
        headType: heads[0]?.name || "Konica 512i",
        headCount: 4,
        width: "3.2m",
        accessories: [] as string[]
    });

    // Pricing State
    const [pricing, setPricing] = useState({
        body: 0,
        service: 125000, // Installation + Warranty
        accessories: 45000, // Basic tool kit + Inks
        discountValue: 0,
        discountSection: "" as "body" | "service" | "accessories" | ""
    });

    // Calculated fields
    useEffect(() => {
        const selectedMachine = machines.find(m => m.name === config.model);
        const selectedHead = heads.find(h => h.name === config.headType);

        if (selectedMachine) {
            const headCost = (selectedHead?.price || 0) * config.headCount;
            const widthCost = WIDTH_COSTS[config.width] || 0;

            // Calculate selected accessories cost
            const selectedAccessoriesCost = config.accessories.reduce((acc, accName) => {
                const item = catalogAccessories.find(a => a.name === accName);
                return acc + (item?.price || 0);
            }, 0);

            setPricing(prev => ({
                ...prev,
                body: selectedMachine.basePrice + headCost + widthCost,
                accessories: 45000 + selectedAccessoriesCost // 45k is basic kit base
            }));
        }
    }, [config, machines, heads, catalogAccessories]);

    const calculateTotal = () => {
        let total = pricing.body + pricing.service + pricing.accessories;
        if (pricing.discountSection === "body") total -= pricing.discountValue;
        if (pricing.discountSection === "service") total -= pricing.discountValue;
        if (pricing.discountSection === "accessories") total -= pricing.discountValue;
        return total;
    };

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = () => {
        const totalRaw = pricing.body + pricing.service + pricing.accessories;
        const discountPercentage = (pricing.discountValue / totalRaw) * 100;

        // Business Rule: Auto-approve if total discount <= 7.5%
        const isAutoApproved = discountPercentage <= 7.5;

        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: 'Running Compliance Check & Generating Quote Reference...',
                success: () => {
                    setTimeout(() => router.push("/leads"), 1000);
                    return isAutoApproved
                        ? 'Quote Generated & Auto-Approved (In-Threshold).'
                        : 'Quote Locked. Manager Notification Sent for Discount Exception Approval.';
                },
                error: 'Submission Failed'
            }
        );
    };

    const toggleAccessory = (accName: string) => {
        setConfig(prev => ({
            ...prev,
            accessories: prev.accessories.includes(accName)
                ? prev.accessories.filter(a => a !== accName)
                : [...prev.accessories, accName]
        }));
    };

    return (
        <div className="flex-1 p-4 md:p-8 pt-6 space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <Icons.arrowRight className="h-4 w-4 rotate-180" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Quotation Wizard</h2>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest text-blue-600">Enterprise Pricing Engine v4.0</p>
                            <Badge variant="outline" className="h-4 text-[8px] bg-blue-50 text-blue-700 font-black">VERSION LOCK ACTIVE</Badge>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className={`h-2 w-2 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                    <div className={`h-2 w-2 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                    <div className={`h-2 w-2 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                </div>
            </div>

            {step === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 shadow-md">
                        <CardHeader>
                            <CardTitle>1. Machine Configuration</CardTitle>
                            <CardDescription>Configure physical hardware and print capabilities.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Lead Association</Label>
                                    <Select value={config.leadId} onValueChange={v => setConfig({ ...config, leadId: v })}>
                                        <SelectTrigger><SelectValue placeholder="Select Lead" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="L-101">Pixel Printers (New Delhi)</SelectItem>
                                            <SelectItem value="L-102">Desmond Digitals (Pune)</SelectItem>
                                            <SelectItem value="L-103">Singh Graphics (Noida)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Base Machine Model</Label>
                                    <Select value={config.model} onValueChange={v => setConfig({ ...config, model: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {machines.map(m => (
                                                <SelectItem key={m.id} value={m.name}>{m.name} ({m.type})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Printhead Type</Label>
                                    <Select value={config.headType} onValueChange={v => setConfig({ ...config, headType: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {heads.map(h => (
                                                <SelectItem key={h.id} value={h.name}>{h.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Head Quantity</Label>
                                    <Select value={config.headCount.toString()} onValueChange={v => setConfig({ ...config, headCount: parseInt(v) })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2">2 Heads</SelectItem>
                                            <SelectItem value="4">4 Heads</SelectItem>
                                            <SelectItem value="8">8 Heads</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Frame Width</Label>
                                    <Select value={config.width} onValueChange={v => setConfig({ ...config, width: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(WIDTH_COSTS).map(w => (
                                                <SelectItem key={w} value={w}>{w}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Optional Accessories</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {catalogAccessories.map(acc => (
                                        <div
                                            key={acc.id}
                                            onClick={() => toggleAccessory(acc.name)}
                                            className={`p-3 border rounded-lg flex items-center gap-3 cursor-pointer transition-all ${config.accessories.includes(acc.name) ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-50'}`}
                                        >
                                            <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${config.accessories.includes(acc.name) ? 'bg-blue-600 border-blue-600' : 'bg-white'}`}>
                                                {config.accessories.includes(acc.name) && <Icons.check className="h-3 w-3 text-white" />}
                                            </div>
                                            <span className="text-xs font-medium">{acc.name} <span className="text-muted-foreground">(₹{acc.price.toLocaleString()})</span></span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700" onClick={handleNext}>
                                Continue to Pricing & Discounts
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="h-fit sticky top-6 bg-slate-50 border-blue-100">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm uppercase text-muted-foreground">Live Config Estimate</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Base Machine</span>
                                    <span className="font-bold">₹ {pricing.body.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Service (Standard)</span>
                                    <span>₹ {pricing.service.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Accessories</span>
                                    <span>₹ {pricing.accessories.toLocaleString()}</span>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-xl font-black">
                                <span>NET TOTAL</span>
                                <span>₹ {calculateTotal().toLocaleString()}</span>
                            </div>
                            <p className="text-[10px] text-center text-muted-foreground italic">* Prices excl. GST. Final values may vary on discount application.</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                                <Icons.warning className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-800">
                                    <strong>Business Policy Clause 4.2:</strong> Discounts are strictly allowed on <strong>ONLY ONE</strong> billable section. Applying a discount to a section will lock all other sections from modification.
                                </p>
                            </div>

                            {/* SECTION 1: BODY */}
                            <Card className={`transition-all ${pricing.discountSection === 'body' ? 'ring-2 ring-blue-600' : ''}`}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50/50">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg">Section 1: Body Billable</CardTitle>
                                        <CardDescription>Main machine chassis, heads & electronics (HSN 8443)</CardDescription>
                                    </div>
                                    <Badge variant="outline" className="bg-white">₹ {pricing.body.toLocaleString()}</Badge>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Section Discount (₹)</Label>
                                            <Input
                                                type="number"
                                                placeholder="Enter amount"
                                                value={pricing.discountSection === 'body' ? pricing.discountValue : ""}
                                                disabled={pricing.discountSection !== "" && pricing.discountSection !== "body"}
                                                onChange={e => {
                                                    setPricing({ ...pricing, discountSection: e.target.value ? "body" : "", discountValue: Number(e.target.value) });
                                                }}
                                            />
                                        </div>
                                        <div className="w-32 text-right">
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground">Section Net</p>
                                            <p className="text-lg font-bold">₹ {(pricing.body - (pricing.discountSection === 'body' ? pricing.discountValue : 0)).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* SECTION 2: SERVICE */}
                            <Card className={`transition-all ${pricing.discountSection === 'service' ? 'ring-2 ring-blue-600' : ''}`}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50/50">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg">Section 2: Extended Service Clause</CardTitle>
                                        <CardDescription>Installation, Training, PMC & Warranty (SAC 9987)</CardDescription>
                                    </div>
                                    <Badge variant="outline" className="bg-white">₹ {pricing.service.toLocaleString()}</Badge>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Section Discount (₹)</Label>
                                            <Input
                                                type="number"
                                                placeholder="Enter amount"
                                                value={pricing.discountSection === 'service' ? pricing.discountValue : ""}
                                                disabled={pricing.discountSection !== "" && pricing.discountSection !== "service"}
                                                onChange={e => {
                                                    setPricing({ ...pricing, discountSection: e.target.value ? "service" : "", discountValue: Number(e.target.value) });
                                                }}
                                            />
                                        </div>
                                        <div className="w-32 text-right">
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground">Section Net</p>
                                            <p className="text-lg font-bold">₹ {(pricing.service - (pricing.discountSection === 'service' ? pricing.discountValue : 0)).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* SECTION 3: ACCESSORIES */}
                            <Card className={`transition-all ${pricing.discountSection === 'accessories' ? 'ring-2 ring-blue-600' : ''}`}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50/50">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg">Section 3: Accessories & Onsites</CardTitle>
                                        <CardDescription>Extra rollers, inks, and physical supplies (HSN 8443)</CardDescription>
                                    </div>
                                    <Badge variant="outline" className="bg-white">₹ {pricing.accessories.toLocaleString()}</Badge>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Section Discount (₹)</Label>
                                            <Input
                                                type="number"
                                                placeholder="Enter amount"
                                                value={pricing.discountSection === 'accessories' ? pricing.discountValue : ""}
                                                disabled={pricing.discountSection !== "" && pricing.discountSection !== "accessories"}
                                                onChange={e => {
                                                    setPricing({ ...pricing, discountSection: e.target.value ? "accessories" : "", discountValue: Number(e.target.value) });
                                                }}
                                            />
                                        </div>
                                        <div className="w-32 text-right">
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground">Section Net</p>
                                            <p className="text-lg font-bold">₹ {(pricing.accessories - (pricing.discountSection === 'accessories' ? pricing.discountValue : 0)).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card className="bg-primary text-primary-foreground shadow-2xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 h-24 w-24 bg-white/10 rounded-full -mr-12 -mt-12" />
                                <CardHeader>
                                    <CardTitle className="text-sm uppercase tracking-widest opacity-80">Quotation Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-3xl font-black">₹ {calculateTotal().toLocaleString()}</p>
                                        <p className="text-[10px] opacity-70 italic">Final billable amount (excl. GST)</p>
                                    </div>
                                    {pricing.discountValue > 0 && (
                                        <div className="p-2 bg-white/20 rounded flex items-center justify-between text-xs font-bold">
                                            <span>SAVINGS APPLIED:</span>
                                            <span>₹ {pricing.discountValue.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <Separator className="bg-white/20" />
                                    <div className="flex items-center gap-2">
                                        <Icons.bell className="h-4 w-4 animate-bounce" />
                                        <p className="text-[10px] font-bold">
                                            Status: {(pricing.discountValue / (pricing.body + pricing.service + pricing.accessories) * 100) > 7.5 ? 'NEEDS MANAGER REVIEW' : 'AUTO-APPROVE READY'}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex flex-col gap-2">
                                <Button className="w-full h-12 gap-2" variant="outline" onClick={() => toast.info("Generating encrypted PDF preview...")}>
                                    <Icons.reports className="h-4 w-4" />
                                    Preview PDF
                                </Button>
                                <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-lg shadow-xl" onClick={handleNext}>
                                    Confirm Configuration
                                </Button>
                                <Button variant="ghost" onClick={handleBack}>Back to Config</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="max-w-2xl mx-auto space-y-6">
                    <Card className="border-2 border-primary shadow-2xl">
                        <CardHeader className="text-center bg-slate-50 border-b relative overflow-hidden">
                            <div className="absolute top-2 right-2">
                                <Badge variant="secondary" className="text-[10px] font-mono">ID: QT-{Math.floor(Date.now() / 100000)}/V1</Badge>
                            </div>
                            <Icons.check className="h-12 w-12 text-green-600 mx-auto mb-2" />
                            <CardTitle className="text-2xl">Ready to Freeze</CardTitle>
                            <CardDescription>
                                Configuration Snapshot generated at {new Date().toLocaleTimeString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                <div><p className="text-muted-foreground uppercase text-[10px] font-bold">Target Client</p><p className="font-bold">{config.leadId}</p></div>
                                <div><p className="text-muted-foreground uppercase text-[10px] font-bold">Machine</p><p className="font-bold">{config.model}</p></div>
                                <div><p className="text-muted-foreground uppercase text-[10px] font-bold">Configuration</p><p className="font-bold">{config.headCount} x {config.headType}</p></div>
                                <div><p className="text-muted-foreground uppercase text-[10px] font-bold">Frame</p><p className="font-bold">{config.width}</p></div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Pricing Breakdown</p>
                                <div className="space-y-1 text-sm font-medium">
                                    <div className="flex justify-between"><span>Body Goods (Net)</span><span>₹ {(pricing.discountSection === 'body' ? pricing.body - pricing.discountValue : pricing.body).toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span>Service Clause (Net)</span><span>₹ {(pricing.discountSection === 'service' ? pricing.service - pricing.discountValue : pricing.service).toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span>Accessories (Net)</span><span>₹ {(pricing.discountSection === 'accessories' ? pricing.accessories - pricing.discountValue : pricing.accessories).toLocaleString()}</span></div>
                                    <div className="flex justify-between text-lg font-black pt-2 border-t mt-2"><span>GRAND TOTAL</span><span>₹ {calculateTotal().toLocaleString()}</span></div>
                                </div>
                            </div>

                            <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                                <Label className="text-xs">Reason for Price Adjustment (Mandatory if &gt; ₹10k discount)</Label>
                                <Input placeholder="e.g., Bulk purchase, Competitive match..." />
                            </div>

                            <div className="flex gap-4">
                                <Button variant="outline" className="flex-1" onClick={handleBack}>Back to Pricing</Button>
                                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleSubmit}>
                                    Submit & Send to Manager
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest font-black">Warning: Static pricing data will be frozen upon submission.</p>
                </div>
            )}
        </div>
    );
}

export default function CreateQuotePage() {
    return (
        <Suspense fallback={<div>Loading quote wizard...</div>}>
            <CreateQuoteContent />
        </Suspense>
    );
}
