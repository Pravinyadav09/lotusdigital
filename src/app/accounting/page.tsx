"use client";

import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { CreateInvoiceDialog } from "@/components/accounting/create-invoice-dialog";
import { EmiCalculator } from "@/components/accounting/emi-calculator";
import { RecordPaymentDialog } from "@/components/accounting/record-payment-dialog";

import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";

export default function AccountingPage() {
    const { user } = useAuth();
    const router = useRouter();
    const isCustomer = user?.role === "customer";
    const isAdmin = user?.role === "super_admin" || user?.role === "finance_user";

    // Filter deals/invoices for customer
    const myDeals = [
        { customer: "Singh Graphics", amount: "₹ 18.2L", stage: "Tax Invoice", progress: 80 },
        { customer: "Singh Graphics", amount: "₹ 5.0L", stage: "Proforma", progress: 30 },
    ].filter(d => !isCustomer || d.customer === user?.name);

    if (isCustomer && myDeals.length === 0) {
        // Mock a deal if none exist for the customer
        myDeals.push({ customer: user?.name || "Customer", amount: "₹ 12.5L", stage: "PI Generated", progress: 40 });
    }

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">
                    {isCustomer ? "Invoices & Payments" : "Accounting & GST"}
                </h2>
                <div className="flex gap-2">
                    {isAdmin && (
                        <Button variant="outline" onClick={() => router.push("/reports")}>
                            <Icons.reports className="mr-2 h-4 w-4" />
                            GST Reports
                        </Button>
                    )}
                    {isAdmin && <CreateInvoiceDialog />}
                    {isCustomer && (
                        <Button variant="outline" onClick={() => toast.promise(new Promise(r => setTimeout(r, 2000)), {
                            loading: 'Generating Full Ledger Statement...',
                            success: 'Customer Account Statement downloaded (PDF)',
                            error: 'Export failed'
                        })}>
                            <Icons.reports className="mr-2 h-4 w-4" />
                            Download Statement
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 h-full">
                {/* Financial Overview Column */}
                <div className="space-y-6 md:col-span-2">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {isCustomer ? "Outstanding Balance" : "Outstanding Balances"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">₹ {isCustomer ? "2,50,000" : "24,50,000"}</div>
                                <p className="text-xs text-muted-foreground">{isCustomer ? "Across 2 invoices" : "Across 8 invoices"}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {isCustomer ? "Total Paid" : "Collected This Month"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">₹ {isCustomer ? "15,70,000" : "12,80,000"}</div>
                                <p className="text-xs text-muted-foreground">{isCustomer ? "Till Date" : "Target: ₹ 15L"}</p>
                            </CardContent>
                        </Card>
                        {!isCustomer && (
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">GST Payable</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">₹ 4,30,500</div>
                                    <p className="text-xs text-muted-foreground">Due by 20th</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <Tabs defaultValue="invoices" className="space-y-4">
                        <TabsList>
                            {!isCustomer && <TabsTrigger value="workflow">Deals Workflow</TabsTrigger>}
                            <TabsTrigger value="invoices">Tax Invoices</TabsTrigger>
                            <TabsTrigger value="pi">Proforma Invoices</TabsTrigger>
                            <TabsTrigger value="payments">Payment History</TabsTrigger>
                        </TabsList>
                        {!isCustomer && (
                            <TabsContent value="workflow">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Deals Lifecycle Tracker</CardTitle>
                                        <CardDescription>Monitor the flow of all active deals from Quote to Payment.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {myDeals.map((deal, i) => (
                                                <div key={i} className="space-y-2 border-b pb-4 last:border-0 last:pb-0">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="font-bold">{deal.customer}</span>
                                                        <span className="text-muted-foreground">{deal.amount}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full transition-all duration-500 ${deal.progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
                                                                style={{ width: `${deal.progress}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-semibold uppercase">{deal.stage}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        )}
                        <TabsContent value="invoices">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{isCustomer ? "My Tax Invoices" : "Recent Tax Invoices"}</CardTitle>
                                    <CardDescription>GST Compliant Invoices.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {(isCustomer ? [
                                            { id: "TI-2024-005", customer: user?.name, amount: "₹ 2,50,000", status: "Overdue", date: "Due 5 days ago" },
                                            { id: "TI-2024-001", customer: user?.name, amount: "₹ 4,50,000", status: "Paid", date: "Paid on 10 Mar" }
                                        ] : [
                                            { id: "TI-2024-002", customer: "Sharma Graphics", amount: "₹ 1,20,000", status: "Overdue", date: "Due 2 Days ago" },
                                            { id: "TI-2024-001", customer: "Pixel Printers", amount: "₹ 4,50,000", status: "Paid", date: "Paid" }
                                        ]).map((invoice) => (
                                            <div key={invoice.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                                                <div>
                                                    <p className="font-medium">{invoice.id}</p>
                                                    <p className="text-sm text-muted-foreground">{!isCustomer && `${invoice.customer} • `}{invoice.date}</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="font-bold">{invoice.amount}</span>
                                                    <Badge variant={invoice.status === 'Paid' ? 'outline' : 'destructive'} className={invoice.status === 'Paid' ? 'text-green-600 border-green-200 bg-green-50' : ''}>
                                                        {invoice.status}
                                                    </Badge>
                                                    <Button variant="ghost" size="sm" onClick={() => toast.success("Sending to printer...")}>
                                                        <Icons.printer className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-4 border-t flex justify-end">
                                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-200" onClick={() => toast.info("Opening PayTM/Upi gateway simulation...")}>
                                            <Icons.accounting className="mr-2 h-4 w-4" />
                                            Pay Outstanding (₹ 2,50,000)
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="pi">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{isCustomer ? "My Proforma Invoices" : "Open Proforma Invoices"}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-b pb-4">
                                            <div>
                                                <p className="font-medium">PI-2024-001</p>
                                                <p className="text-sm text-muted-foreground">{isCustomer ? "Active Order" : "Lotus Printing Press"}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="font-bold">₹ 12,50,000</span>
                                                <Badge variant="outline">Pending Payment</Badge>
                                                <Button variant="ghost" size="sm" onClick={() => toast.success("Document Loading...")}>View</Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="payments">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>{isCustomer ? "My Payment Receipts" : "Payment History"}</CardTitle>
                                        <CardDescription>Receipts and advances.</CardDescription>
                                    </div>
                                    {isAdmin && <RecordPaymentDialog />}
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-b pb-4">
                                            <div>
                                                <p className="font-medium">REC-2024-882</p>
                                                <p className="text-sm text-muted-foreground">{isCustomer ? "NEFT Payment" : "Sharma Graphics • NEFT"}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="font-bold text-green-600">+ ₹ 2,00,000</span>
                                                <Badge>Cleared</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Calculator Column */}
                <div className="md:col-span-1">
                    <EmiCalculator />
                </div>
            </div>
        </div>
    );
}
