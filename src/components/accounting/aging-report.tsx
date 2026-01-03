"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function AgingReport() {
    const agingData = [
        { customer: "Pixel Printers", total: 250000, current: 120000, "1-30": 80000, "31-60": 50000, "60+": 0, risk: "Low" },
        { customer: "Sharma Graphics", total: 120000, current: 0, "1-30": 0, "31-60": 0, "60+": 120000, risk: "High (Locked)" },
        { customer: "Singh Graphics", total: 450000, current: 450000, "1-30": 0, "31-60": 0, "60+": 0, risk: "None" },
    ];

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Accounts Receivable Aging Report</CardTitle>
                <CardDescription>Overview of outstanding dues by aging buckets.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[150px] bg-muted/30 font-bold">Customer</TableHead>
                                <TableHead className="text-right min-w-[120px] bg-muted/30 font-bold">Total (₹)</TableHead>
                                <TableHead className="text-right min-w-[120px] bg-muted/30 font-bold">Current</TableHead>
                                <TableHead className="text-right min-w-[120px] bg-muted/30 font-bold">1-30 Days</TableHead>
                                <TableHead className="text-right min-w-[120px] bg-muted/30 font-bold">31-60 Days</TableHead>
                                <TableHead className="text-right min-w-[120px] bg-muted/30 font-bold">60+ Days</TableHead>
                                <TableHead className="text-right min-w-[150px] bg-muted/30 font-bold">Risk Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {agingData.map((row) => (
                                <TableRow key={row.customer}>
                                    <TableCell className="font-medium text-xs">{row.customer}</TableCell>
                                    <TableCell className="text-right font-bold text-xs">{row.total.toLocaleString()}</TableCell>
                                    <TableCell className="text-right text-xs">{row.current.toLocaleString()}</TableCell>
                                    <TableCell className="text-right text-xs">{row["1-30"] > 0 ? row["1-30"].toLocaleString() : "-"}</TableCell>
                                    <TableCell className="text-right text-xs">{row["31-60"] > 0 ? row["31-60"].toLocaleString() : "-"}</TableCell>
                                    <TableCell className={`text-right text-xs ${row["60+"] > 0 ? "text-red-600 font-bold" : ""}`}>{row["60+"] > 0 ? row["60+"].toLocaleString() : "-"}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={row.risk === 'None' ? 'outline' : row.risk.includes('High') ? 'destructive' : 'default'} className="text-[9px]">
                                            {row.risk}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-4 p-4 bg-muted/20 border-l-4 border-red-500 rounded text-xs text-muted-foreground">
                    <p className="font-bold text-red-700 mb-1">Aging Rule Alert:</p>
                    Any amount in the '60+ Days' bucket triggers an automatic **Admin Machine Lock** across all associated serial numbers. Interest is calculated daily on the Total Outstanding.
                </div>
            </CardContent>
        </Card>
    );
}
