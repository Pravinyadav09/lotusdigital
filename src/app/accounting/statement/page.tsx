"use client";

import { useAuth } from "@/providers/auth-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Business Rule: 1st of month notifications, Due by 7th, 18% p.a. simple interest on delay.
const OVERDUE_INVOICES = [
    { id: "INV-2024-001", date: "2024-04-01", due: "2024-04-07", base: 500000, paid: 200000, delayDays: 85, interestRate: 0.18 },
    { id: "INV-2024-015", date: "2024-06-01", due: "2024-06-07", base: 125000, paid: 0, delayDays: 25, interestRate: 0.18 },
];

export default function AccountStatementPage() {
    const { user } = useAuth();
    const isCustomer = user?.role === "customer";

    const calculateInterest = (principal: number, days: number, rate: number) => {
        return (principal * rate * days) / 365;
    };

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl md:text-3xl font-bold tracking-tight">Financial Statement</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">{isCustomer ? "My Account Balance & Interest Dues" : "Customer Aging & Interest Ledger"}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none h-8" onClick={() => toast.success("Statement PDF generated and downloading...")}>
                        <Icons.reports className="mr-2 h-4 w-4" />
                        Download Statement
                    </Button>
                    <Badge variant="destructive" className="flex-1 sm:flex-none h-8 px-4 text-[10px] font-bold uppercase animate-pulse justify-center">
                        Rule: 18% P.A. Penalty
                    </Badge>
                </div>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Total Outstanding</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-red-600">₹ 4,25,000</div></CardContent>
                </Card>
                <Card className="border-amber-200 bg-amber-50/20">
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Accrued Interest</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-amber-700">₹ 14,850</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Paid Till Date</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-green-600">₹ 8,75,000</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Credit Limit</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">₹ 15,00,000</div></CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Aging Ledger & Penalty Tracker</CardTitle>
                    <CardDescription>Daily interest calculation for delayed payments.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[100px]">Invoice #</TableHead>
                                    <TableHead className="min-w-[100px]">Due Date</TableHead>
                                    <TableHead className="min-w-[120px]">Principal Bal</TableHead>
                                    <TableHead className="min-w-[100px]">Delay</TableHead>
                                    <TableHead className="min-w-[140px]">Daily Interest</TableHead>
                                    <TableHead className="text-right min-w-[120px]">Total Penalty</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {OVERDUE_INVOICES.map((inv) => {
                                    const principal = inv.base - inv.paid;
                                    const interest = calculateInterest(principal, inv.delayDays, inv.interestRate);
                                    const daily = calculateInterest(principal, 1, inv.interestRate);
                                    return (
                                        <TableRow key={inv.id}>
                                            <TableCell className="font-mono text-xs">{inv.id}</TableCell>
                                            <TableCell className="text-xs text-red-600 font-bold">{inv.due}</TableCell>
                                            <TableCell className="font-medium">₹ {principal.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="bg-red-50 text-red-700 text-[10px]">{inv.delayDays} Days</Badge>
                                            </TableCell>
                                            <TableCell className="text-xs">₹ {daily.toFixed(2)} / day</TableCell>
                                            <TableCell className="text-right font-bold text-amber-700">₹ {interest.toFixed(2)}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row sm:justify-end p-4 border-t bg-muted/20 rounded-lg gap-4">
                <div className="text-left sm:text-right space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase">Grand Total Payable</p>
                    <p className="text-2xl sm:text-3xl font-black text-red-700 tracking-tighter">₹ 4,39,850.00</p>
                </div>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="p-4 border rounded-lg bg-blue-50/30">
                    <div className="flex items-center gap-2 mb-2">
                        <Icons.message className="h-4 w-4 text-blue-600" />
                        <h4 className="text-sm font-bold">Automation Logs</h4>
                    </div>
                    <ul className="text-[10px] space-y-2 text-muted-foreground">
                        <li>• 1st Jan: EMI Reminders dispatched via SMS/WhatsApp/Email.</li>
                        <li>• 7th Jan: Payment deadline reached. 0 customers cleared dues.</li>
                        <li>• 8th Jan: Interest calculation (18% p.a.) triggered for 65 invoices.</li>
                        <li>• 10th Jan: Machine 'Locked' status enforced for 3 accounts beyond grace.</li>
                    </ul>
                </div>
                <div className="p-4 border rounded-lg bg-red-50/30">
                    <div className="flex items-center gap-2 mb-2">
                        <Icons.warning className="h-4 w-4 text-red-600" />
                        <h4 className="text-sm font-bold">Lock Policy Trigger</h4>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                        If interest + principal exceeds 25% of the machine value OR delay exceeds 30 days, hardware command is sent to PCB to 'Lock' machine operations. Service Engineers are notified to strictly avoid repairs on locked machines.
                    </p>
                </div>
            </div>
        </div>
    );
}
