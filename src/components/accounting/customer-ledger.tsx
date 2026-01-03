"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export function CustomerLedger({ customerName = "Pixel Printers" }) {
    // Interest is system-calculated: 18% per annum simple interest on delayed payments (post 7th of month)
    const ledgerEntries = [
        { date: "2024-03-01", desc: "EMI #1 Charged (TI-2024-001)", debit: 120000, credit: 0, balance: 120000 },
        { date: "2024-03-05", desc: "Payment Received (REC-882)", debit: 0, credit: 120000, balance: 0 },
        { date: "2024-03-15", desc: "Service Charge (Consultation)", debit: 5000, credit: 0, balance: 5000 },
        { date: "2024-03-20", desc: "Payment Received (REC-910)", debit: 0, credit: 5000, balance: 0 },
        { date: "2024-04-01", desc: "EMI #2 Charged (TI-2024-001)", debit: 120000, credit: 0, balance: 120000 },
        { date: "2024-04-10", desc: "7-Day Penalty Grace Expired", debit: 0, credit: 0, balance: 120000 },
        { date: "2024-04-20", desc: "Partial Payment (REC-955)", debit: 0, credit: 50000, balance: 70000 },
        { date: "2024-04-30", desc: "Delayed Interest (18% p.a. - 23 Days)", debit: 1361, credit: 0, balance: 71361 },
        { date: "2024-05-01", desc: "EMI #3 Charged (TI-2024-001)", debit: 120000, credit: 0, balance: 191361 },
        { date: "2024-05-05", desc: "Toner Purchase (Inv-505)", debit: 15000, credit: 0, balance: 206361 },
        { date: "2024-05-06", desc: "Payment Received (REC-1002)", debit: 0, credit: 50000, balance: 156361 },
    ];

    const totalOutstanding = ledgerEntries[ledgerEntries.length - 1].balance;

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <CardTitle>Customer Ledger & Statement</CardTitle>
                    <CardDescription>Consolidated financial history for {customerName}</CardDescription>
                </div>
                <div className="flex w-full sm:w-auto gap-2">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none h-8 text-xs" onClick={() => toast.success("WhatsApp Statement Sent to Customer")}>
                        <Icons.message className="mr-2 h-4 w-4 text-green-600" />
                        Send WhatsApp
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none h-8 text-xs" onClick={() => toast.success("PDF Downloaded")}>
                        <Icons.printer className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border overflow-x-auto">
                    <Table className="min-w-[700px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[120px] bg-muted/30 font-bold">Date</TableHead>
                                <TableHead className="min-w-[200px] bg-muted/30 font-bold">Description</TableHead>
                                <TableHead className="text-right bg-muted/30 font-bold">Debit (₹)</TableHead>
                                <TableHead className="text-right bg-muted/30 font-bold">Credit (₹)</TableHead>
                                <TableHead className="text-right bg-muted/30 font-bold">Balance (₹)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ledgerEntries.map((entry, i) => (
                                <TableRow key={i} className={entry.desc.includes("Interest") ? "bg-red-50/50" : ""}>
                                    <TableCell className="text-xs">{entry.date}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium">{entry.desc}</span>
                                            {entry.desc.includes("Interest") && (
                                                <span className="text-[10px] text-red-500 italic">Penalty Interest Policy (18% p.a.)</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right text-xs">{entry.debit > 0 ? entry.debit.toLocaleString() : "-"}</TableCell>
                                    <TableCell className="text-right text-xs text-green-600 font-medium">{entry.credit > 0 ? entry.credit.toLocaleString() : "-"}</TableCell>
                                    <TableCell className="text-right text-xs font-bold">{entry.balance.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-muted/20 rounded-lg gap-4">
                    <div className="space-y-1">
                        <p className="text-sm font-bold">Total Payable Balance</p>
                        <p className="text-[11px] text-muted-foreground">Includes principal EMI and accrued interest as of today.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-2xl font-black text-red-600">₹ {totalOutstanding.toLocaleString()}</div>
                            {totalOutstanding > 200000 && (
                                <Badge variant="destructive" className="animate-pulse">
                                    <Icons.warning className="mr-1 h-3 w-3" /> Machine Lock Impending
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border border-dashed rounded-lg space-y-3">
                        <h4 className="text-sm font-bold flex items-center gap-2">
                            <Icons.accounting className="h-4 w-4" />
                            Business Rules Applied
                        </h4>
                        <ul className="text-[11px] space-y-2 text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1" />
                                Payment Window: 1st to 7th of every month.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1" />
                                Late Fee: 18% p.a. simple interest starts from 8th.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1" />
                                Lock Trigger: Unpaid dues exceeding 15 days from 7th.
                            </li>
                        </ul>
                    </div>

                    <div className="p-4 border border-dashed rounded-lg space-y-3 bg-blue-50/10">
                        <h4 className="text-sm font-bold flex items-center gap-2">
                            <Icons.message className="h-4 w-4" />
                            Notification Status
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-[11px]">
                                <span>Monthly Alert (1st May)</span>
                                <Badge variant="outline" className="text-[9px] bg-green-50">SENT (WhatsApp)</Badge>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                                <span>Late Warning (8th May)</span>
                                <Badge variant="outline" className="text-[9px] bg-amber-50">SENT (Sms)</Badge>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                                <span>Final Lock Notice (15th May)</span>
                                <Badge variant="outline" className="text-[9px] bg-red-50">QUEUED</Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
