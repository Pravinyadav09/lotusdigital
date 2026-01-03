"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";

export function EmiCalculator() {
    const [principal, setPrincipal] = useState(500000);
    const [rate, setRate] = useState(18); // Default 18% as per prompt
    const [months, setMonths] = useState(6);
    const [delayedDays, setDelayedDays] = useState(0);

    // EMI Formula: P x R x (1+R)^N / ((1+R)^N-1)
    const r = rate / 12 / 100;
    const emi = principal * r * (Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1));
    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;

    // Delay Penalty Logic
    const penaltyInterest = (emi * (rate / 100) * delayedDays) / 365;

    return (
        <Card className="h-full shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Icons.calculator className="h-5 w-5 text-blue-600" />
                    EMI & Penalty Calculator
                </CardTitle>
                <CardDescription>Plan EMI structure and calculate late fees.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Loan/Principal Amount (₹)</Label>
                    <Input
                        type="number"
                        value={principal}
                        onChange={(e) => setPrincipal(Number(e.target.value))}
                        className="h-9"
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label>Tenure (Months)</Label>
                        <span className="text-sm font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{months} Months</span>
                    </div>
                    <Slider
                        value={[months]}
                        onValueChange={(v) => setMonths(v[0])}
                        min={1} max={36} step={1}
                        className="py-2"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100/50">
                        <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Monthly EMI</p>
                        <p className="text-lg font-black text-blue-900">₹ {Math.round(emi).toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total Interest</p>
                        <p className="text-lg font-black text-slate-900">₹ {Math.round(totalInterest).toLocaleString()}</p>
                    </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-dashed">
                    <div className="flex items-center gap-2">
                        <Label className="text-sm">Late Payment Simulator</Label>
                        <Badge variant="outline" className="text-[8px] text-red-600 bg-red-50">18% P.A.</Badge>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="space-y-1">
                            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Days Delayed</Label>
                            <Input
                                type="number"
                                value={delayedDays}
                                onChange={(e) => setDelayedDays(Number(e.target.value))}
                                className="h-8 text-sm"
                            />
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg border border-red-100 flex flex-col justify-center">
                            <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Estimated Penalty Interest</span>
                            <span className="text-lg font-black text-red-700">₹ {Math.round(penaltyInterest).toLocaleString()}</span>
                            <p className="text-[9px] text-red-600 mt-1">*Simple interest applied on EMI amount</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
