"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function CreateQuotePage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [quote, setQuote] = useState({
        leadId: "",
        model: "",
        sections: {
            body: { price: 1200000, discount: 0, hsn: "8443" },
            service: { price: 150000, discount: 0, sac: "9987" },
            accessories: { price: 250000, discount: 0, hsn: "8443" }
        }
    });

    const calculateTotal = () => {
        const bodySubtotal = quote.sections.body.price - quote.sections.body.discount;
        const serviceSubtotal = quote.sections.service.price - quote.sections.service.discount;
        const accessoriesSubtotal = quote.sections.accessories.price - quote.sections.accessories.discount;
        return bodySubtotal + serviceSubtotal + accessoriesSubtotal;
    };

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = () => {
        const total = calculateTotal();
        const discountPercent = (quote.sections.body.discount / quote.sections.body.price) * 100;

        if (discountPercent > 10) {
            toast.warning("High Discount Detected! This quote will require Sales Manager approval.");
        }

        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1500)),
            {
                loading: 'Generating Quote Version V1...',
                success: () => {
                    setTimeout(() => router.push("/quotes"), 500);
                    return 'Quote Generated and Frozen. Sent for Approval.';
                },
                error: 'Submission Failed',
            }
        );
    };

    return (
        <div className="flex-1 p-4 md:p-8 pt-6 space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <Icons.arrowRight className="h-4 w-4 rotate-180" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Create Quotation</h2>
                    <p className="text-muted-foreground">Enforcing 3-Section Business Logic</p>
                </div>
            </div>

            {/* Step Progress */}
            <div className="flex items-center gap-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold ${step >= i ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                            {i}
                        </div>
                        {i < 4 && <div className={`h-1 w-12 rounded ${step > i ? 'bg-primary' : 'bg-muted'}`} />}
                    </div>
                ))}
            </div>

            {step === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Select Lead & Machine</CardTitle>
                        <CardDescription>Choose the target customer and base model.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Customer / Lead</Label>
                            <Select onValueChange={(v) => setQuote({ ...quote, leadId: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an active lead" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="l1">Pixel Printers (New Delhi)</SelectItem>
                                    <SelectItem value="l2">Singh Graphics (Punjab)</SelectItem>
                                    <SelectItem value="l3">Creative Ads (Mumbai)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Machine Model</Label>
                            <Select onValueChange={(v) => setQuote({ ...quote, model: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select base model" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="m1">Lotus Max 5000 (Inkjet)</SelectItem>
                                    <SelectItem value="m2">Lotus Pro 2000 (Laser)</SelectItem>
                                    <SelectItem value="m3">Lotus Hybrid X1</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="w-full" onClick={handleNext} disabled={!quote.leadId || !quote.model}>Continue to Configuration</Button>
                    </CardContent>
                </Card>
            )}

            {step === 2 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Core Configuration</CardTitle>
                        <CardDescription>Select printheads and widths.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label>Printhead Type</Label>
                                <Select defaultValue="k512">
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="k512">Konica 512i (High Speed)</SelectItem>
                                        <SelectItem value="k1024">Konica 1024 (High Res)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Quantity</Label>
                                <Select defaultValue="4">
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2">2 Heads</SelectItem>
                                        <SelectItem value="4">4 Heads</SelectItem>
                                        <SelectItem value="8">8 Heads</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Print Width</Label>
                                <Select defaultValue="10ft">
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10ft">10 Feet (Standard)</SelectItem>
                                        <SelectItem value="5ft">5 Feet (Compact)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Optional Accessories</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Badge variant="outline" className="justify-start p-2 gap-2 cursor-pointer border-primary/50">
                                    <Input type="checkbox" className="h-4 w-4" defaultChecked />
                                    Extra Take-up Roller
                                </Badge>
                                <Badge variant="outline" className="justify-start p-2 gap-2 cursor-pointer">
                                    <Input type="checkbox" className="h-4 w-4" />
                                    UV Curing Lamp
                                </Badge>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="outline" className="flex-1" onClick={handleBack}>Back</Button>
                            <Button className="flex-1" onClick={handleNext}>Next: Pricing</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {step === 3 && (
                <div className="space-y-6">
                    {/* SECTION 1: BODY */}
                    <Card className="border-blue-200">
                        <CardHeader className="bg-blue-50/50">
                            <div className="flex justify-between">
                                <div>
                                    <CardTitle>Section 1: Body (Goods)</CardTitle>
                                    <CardDescription>Machine chassis and core electronics. HSN: 8443</CardDescription>
                                </div>
                                <Badge>Billable Head: BODY</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Base Body Price (₹)</Label>
                                    <Input type="number" value={quote.sections.body.price} readOnly className="bg-muted" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Discount (₹)</Label>
                                    <Input
                                        type="number"
                                        placeholder="Section Discount"
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            setQuote({
                                                ...quote,
                                                sections: {
                                                    ...quote.sections,
                                                    body: { ...quote.sections.body, discount: val },
                                                    service: { ...quote.sections.service, discount: 0 },
                                                    accessories: { ...quote.sections.accessories, discount: 0 }
                                                }
                                            });
                                        }}
                                        disabled={quote.sections.service.discount > 0 || quote.sections.accessories.discount > 0}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SECTION 2: SERVICE */}
                    <Card className="border-green-200">
                        <CardHeader className="bg-green-50/50">
                            <div className="flex justify-between">
                                <div>
                                    <CardTitle>Section 2: Service Clause (SAC)</CardTitle>
                                    <CardDescription>Installation, Training, Warranty. SAC: 9987</CardDescription>
                                </div>
                                <Badge className="bg-green-600">Billable Head: SERVICE</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Package Price (₹)</Label>
                                    <Input type="number" value={quote.sections.service.price} readOnly className="bg-muted" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Discount (₹)</Label>
                                    <Input
                                        type="number"
                                        placeholder="Section Discount"
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            setQuote({
                                                ...quote,
                                                sections: {
                                                    ...quote.sections,
                                                    body: { ...quote.sections.body, discount: 0 },
                                                    service: { ...quote.sections.service, discount: val },
                                                    accessories: { ...quote.sections.accessories, discount: 0 }
                                                }
                                            });
                                        }}
                                        disabled={quote.sections.body.discount > 0 || quote.sections.accessories.discount > 0}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SECTION 3: ACCESSORIES */}
                    <Card className="border-amber-200">
                        <CardHeader className="bg-amber-50/50">
                            <div className="flex justify-between">
                                <div>
                                    <CardTitle>Section 3: Accessories (Goods)</CardTitle>
                                    <CardDescription>Spare parts kit, rollers, basic inks. HSN: 8443</CardDescription>
                                </div>
                                <Badge className="bg-amber-600">Billable Head: GOODS</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Accessories Value (₹)</Label>
                                    <Input type="number" value={quote.sections.accessories.price} readOnly className="bg-muted" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Discount (₹)</Label>
                                    <Input
                                        type="number"
                                        placeholder="Section Discount"
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            setQuote({
                                                ...quote,
                                                sections: {
                                                    ...quote.sections,
                                                    body: { ...quote.sections.body, discount: 0 },
                                                    service: { ...quote.sections.service, discount: 0 },
                                                    accessories: { ...quote.sections.accessories, discount: val }
                                                }
                                            });
                                        }}
                                        disabled={quote.sections.body.discount > 0 || quote.sections.service.discount > 0}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <p className="text-[10px] text-muted-foreground italic px-2">* Business Rule: Discount allowed on one section only. Non-chosen sections are locked.</p>


                    <div className="flex gap-4">
                        <Button variant="outline" className="flex-1" onClick={handleBack}>Back</Button>
                        <Button className="flex-1" onClick={handleNext}>Review Summary</Button>
                    </div>
                </div>
            )}

            {step === 4 && (
                <Card className="border-2 border-primary">
                    <CardHeader className="text-center">
                        <CardTitle>Draft Quotation Review</CardTitle>
                        <CardDescription>Final check before freezing the configuration.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 bg-muted rounded-lg space-y-4">
                            <div className="flex justify-between text-sm">
                                <span>Section 1: Body (Goods)</span>
                                <div className="text-right">
                                    <span className="font-bold">₹ {(quote.sections.body.price - quote.sections.body.discount).toLocaleString()}</span>
                                    {quote.sections.body.discount > 0 && <p className="text-[10px] text-green-600">Incl. ₹{quote.sections.body.discount.toLocaleString()} Discount</p>}
                                </div>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Section 2: Service Clause (SAC)</span>
                                <div className="text-right">
                                    <span className="font-bold">₹ {(quote.sections.service.price - quote.sections.service.discount).toLocaleString()}</span>
                                    {quote.sections.service.discount > 0 && <p className="text-[10px] text-green-600">Incl. ₹{quote.sections.service.discount.toLocaleString()} Discount</p>}
                                </div>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Section 3: Accessories (Goods)</span>
                                <div className="text-right">
                                    <span className="font-bold">₹ {(quote.sections.accessories.price - quote.sections.accessories.discount).toLocaleString()}</span>
                                    {quote.sections.accessories.discount > 0 && <p className="text-[10px] text-green-600">Incl. ₹{quote.sections.accessories.discount.toLocaleString()} Discount</p>}
                                </div>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Sub-Total (Taxable)</span>
                                <span className="text-primary">₹ {calculateTotal().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground italic">
                                <span>Estimated GST (18.00%)</span>
                                <span>₹ {(calculateTotal() * 0.18).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="p-4 border-2 border-dashed rounded-lg space-y-2">
                            <Label>Approval Note (Optional)</Label>
                            <Input placeholder="Why is this discount being given?" />
                        </div>

                        <div className="flex gap-4">
                            <Button variant="outline" className="flex-1" onClick={handleBack}>Back to Pricing</Button>
                            <Button className="flex-1 bg-primary text-primary-foreground" onClick={handleSubmit}>
                                Freeze & Submit Quote
                            </Button>
                        </div>
                        <p className="text-[11px] text-center text-muted-foreground uppercase font-bold tracking-tighter">
                            Note: Once submitted, pricing sections are locked. Changes require a new version.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
