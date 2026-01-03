"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Icons } from "@/components/icons";

export function EmiCalculator() {
    const [principal, setPrincipal] = useState(500000);
    const [rate, setRate] = useState(18); // Default 18% as per prompt
    const [months, setMonths] = useState(6);
    const [delayedDays, setDelayedDays] = useState(0);

    // EMI Formula: P x R x (1+R)^N / ((1+R)^N-1)
    // But prompt mentions simple interest on delays: "18% p.a. simple interest on delays"
    // For standard EMI (Amortization):
    const r = rate / 12 / 100;
    const emi = principal * r * (Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1));
    const totalAmount = emi * months;

    // Delay Penalty Logic
    const penaltyInterest = (emi * (rate / 100) * delayedDays) / 365;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Icons.calculator className="h-5 w-5" />
                    EMI & Penalty Calculator
                </CardTitle>
                <CardDescription>Plan EMI structure and calculate late fees.</CardDescription>
            </CardHeader>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <div className="space-y-2">
                    <Label>Loan/Principal Amount (₹)</Label>
                    <Input
                        type="number"
                        value={principal}
                        onChange={(e) => setPrincipal(Number(e.target.value))}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label>Tenure (Months)</Label>
                        <span className="text-sm font-medium text-muted-foreground">{months} Months</span>
                    </div>
                    <Slider
                        value={[months]}
                        onValueChange={(v) => setMonths(v[0])}
                        min={1} max={36} step={1}
                    />
                </div>

                <div className="p-4 bg-muted/20 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Monthly EMI:</span>
                        <span className="font-bold">₹ {Math.round(emi).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Total Payable:</span>
                        <span>₹ {Math.round(totalAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600">
                        <span>Interest Charged:</span>
                        <span>₹ {Math.round(totalAmount - principal).toLocaleString()}</span>
                    </div>
                </div>

                <div className="space-y-2 pt-2 border-t">
                    <Label>Late Payment Simulator</Label>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 space-y-1">
                            <Label className="text-xs text-muted-foreground">Days Delayed</Label>
                            <Input
                                type="number"
                                value={delayedDays}
                                onChange={(e) => setDelayedDays(Number(e.target.value))}
                            />
                        </div>
                        <div className="flex-1 p-2 bg-red-50 rounded border border-red-100 flex flex-col justify-center">
                            <span className="text-xs text-red-500 font-medium">Penalty Interest</span>
                            <span className="font-bold text-red-700">₹ {Math.round(penaltyInterest).toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-[10px] text-blue-600 font-bold uppercase">Monthly EMI</p>
                            <p className="text-base sm:text-lg font-black text-blue-900">₹ {Math.round(emi).toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="text-[10px] text-muted-foreground font-bold uppercase">Total Interest</p>
                            <p className="text-base sm:text-lg font-black text-slate-900">₹ {Math.round(totalInterest).toLocaleString()}</p>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">*18% p.a. simple interest applied on delayed EMI amount.</p>
                </div>
            </DialogContent>
        </Card>
    );
}
