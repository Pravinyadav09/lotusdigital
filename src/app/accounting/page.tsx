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
import { CustomerLedger } from "@/components/accounting/customer-ledger";
import { AgingReport } from "@/components/accounting/aging-report";
import { CreditNoteDialog } from "@/components/accounting/credit-note-dialog";

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
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl md:text-3xl font-bold tracking-tight">
                    {isCustomer ? "Invoices & Payments" : "Accounting & GST"}
                </h2>
                <div className="flex flex-wrap gap-2">
                    {isAdmin && (
                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={() => router.push("/reports")}>
                            <Icons.reports className="mr-2 h-4 w-4" />
                            GST Reports
                        </Button>
                    )}
                    {isAdmin && <CreateInvoiceDialog />}
                    {isAdmin && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-purple-50 text-purple-700 border-purple-200 flex-1 sm:flex-none"
                            onClick={() => toast.promise(new Promise(r => setTimeout(r, 2000)), {
                                loading: 'Triggering Monthly EMI Alerts (1st of Month)...',
                                success: 'WhatsApp/SMS broadcasts dispatched to all customers with active EMI plans.',
                                error: 'Service Unavailable'
                            })}
                        >
                            <Icons.message className="mr-2 h-4 w-4" />
                            Alerts
                        </Button>
                    )}
                    {isCustomer && (
                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={() => toast.promise(new Promise(r => setTimeout(r, 2000)), {
                            loading: 'Generating Full Ledger Statement...',
                            success: 'Customer Account Statement downloaded (PDF)',
                            error: 'Export failed'
                        })}>
                            <Icons.reports className="mr-2 h-4 w-4" />
                            Statement
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 h-full">
                {/* Financial Overview Column */}
                <div className="space-y-6 lg:col-span-2">
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Outstanding</CardTitle></CardHeader>
                            <CardContent><div className="text-xl sm:text-2xl font-bold text-red-600">₹ 4,25,000</div></CardContent>
                        </Card>
                        <Card className="border-amber-200 bg-amber-50/20">
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Accrued Interest</CardTitle></CardHeader>
                            <CardContent><div className="text-xl sm:text-2xl font-bold text-amber-700">₹ 14,850</div></CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Paid Till Date</CardTitle></CardHeader>
                            <CardContent><div className="text-xl sm:text-2xl font-bold text-green-600">₹ 8,75,000</div></CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Credit Limit</CardTitle></CardHeader>
                            <CardContent><div className="text-xl sm:text-2xl font-bold">₹ 15,00,000</div></CardContent>
                        </Card>
                    </div>

                    <Tabs defaultValue="invoices" className="space-y-4">
                        <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-muted/20">
                            {!isCustomer && <TabsTrigger value="workflow" className="flex-1 sm:flex-none">Deals Workflow</TabsTrigger>}
                            <TabsTrigger value="pi" className="flex-1 sm:flex-none">Proforma</TabsTrigger>
                            <TabsTrigger value="so" className="flex-1 sm:flex-none">SO</TabsTrigger>
                            <TabsTrigger value="invoices" className="flex-1 sm:flex-none">Invoices</TabsTrigger>
                            <TabsTrigger value="payments" className="flex-1 sm:flex-none">Payments</TabsTrigger>
                            <TabsTrigger value="ledger" className="flex-1 sm:flex-none">Ledger</TabsTrigger>
                            <TabsTrigger value="aging" className="flex-1 sm:flex-none">Aging</TabsTrigger>
                            <TabsTrigger value="credit" className="flex-1 sm:flex-none">Credit</TabsTrigger>
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
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1">
                                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full transition-all duration-500 ${deal.progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
                                                                style={{ width: `${deal.progress}%` }}
                                                            />
                                                        </div>
                                                        <div className="flex items-center justify-between sm:justify-start gap-2">
                                                            <span className="text-[10px] font-semibold uppercase">{deal.stage}</span>
                                                            {user?.role === 'super_admin' && deal.progress < 100 && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-6 text-[10px] text-orange-600 hover:text-orange-700 hover:bg-orange-50 border border-orange-100"
                                                                    onClick={() => toast.success(`Managerial Override: Deal ${deal.customer} fast-tracked. TI generated bypassing advance lock.`)}
                                                                >
                                                                    Fast Track
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        )}
                        <TabsContent value="so">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Manufacturing & Sales Orders</CardTitle>
                                    <CardDescription>Orders confirmed after PI payment. Manufacturing release stage.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[
                                            { id: "SO-2024-042", customer: "Pixel Printers", machine: "Lotus Max 5000", status: "Production", emi: "Tagged (12 Months)" },
                                            { id: "SO-2024-039", customer: "Singh Graphics", machine: "Lotus Pro 2000", status: "QC Check", emi: "Direct Payment" },
                                        ].map((so) => (
                                            <div key={so.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 last:border-0 gap-4">
                                                <div>
                                                    <p className="font-bold text-sm">{so.id} • {so.machine}</p>
                                                    <p className="text-xs text-muted-foreground">{so.customer} • {so.emi}</p>
                                                </div>
                                                <div className="flex items-center gap-4 justify-between sm:justify-end">
                                                    <Badge variant="secondary" className="text-[10px]">{so.status}</Badge>
                                                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.info("Viewing SO Tracking Log...")}>Track</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
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
                                            <div key={invoice.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 last:border-0 gap-4">
                                                <div>
                                                    <p className="font-medium">{invoice.id}</p>
                                                    <p className="text-sm text-muted-foreground">{!isCustomer && `${invoice.customer} • `}{invoice.date}</p>
                                                </div>
                                                <div className="flex items-center gap-4 justify-between sm:justify-end">
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className="font-bold">{invoice.amount}</span>
                                                        <Badge variant={invoice.status === 'Paid' ? 'outline' : 'destructive'} className={`text-[10px] ${invoice.status === 'Paid' ? 'text-green-600 border-green-200 bg-green-50' : ''}`}>
                                                            {invoice.status}
                                                        </Badge>
                                                    </div>
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
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
                                            <div>
                                                <p className="font-medium">PI-2024-001</p>
                                                <p className="text-sm text-muted-foreground">{isCustomer ? "Active Order" : "Lotus Printing Press"}</p>
                                            </div>
                                            <div className="flex items-center gap-4 justify-between sm:justify-end">
                                                <span className="font-bold text-sm sm:text-base">₹ 12,50,000</span>
                                                <Badge variant="outline" className="text-[10px]">Pending Payment</Badge>
                                                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.success("Document Loading...")}>View</Button>
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
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
                                            <div>
                                                <p className="font-medium">REC-2024-882</p>
                                                <p className="text-sm text-muted-foreground">{isCustomer ? "NEFT Payment" : "Sharma Graphics • NEFT"}</p>
                                            </div>
                                            <div className="flex items-center gap-4 justify-between sm:justify-end">
                                                <span className="font-bold text-green-600">+ ₹ 2,00,000</span>
                                                <Badge className="text-[10px]">Cleared</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="ledger">
                            <CustomerLedger customerName={isCustomer ? user?.name : "Pixel Printers"} />
                        </TabsContent>
                        <TabsContent value="aging">
                            <AgingReport />
                        </TabsContent>
                        <TabsContent value="credit">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Credit Notes & Adjustments</CardTitle>
                                        <CardDescription>Sales returns and billing corrections.</CardDescription>
                                    </div>
                                    {isAdmin && <CreditNoteDialog />}
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[
                                            { id: "CN-2024-001", customer: "Pixel Printers", amount: "₹ 15,000", reason: "Billing Correction", date: "15 May" },
                                        ].map((cn) => (
                                            <div key={cn.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 last:border-0 gap-4">
                                                <div>
                                                    <p className="font-medium text-sm">{cn.id}</p>
                                                    <p className="text-xs text-muted-foreground">{cn.customer} • {cn.reason} • {cn.date}</p>
                                                </div>
                                                <div className="flex items-center gap-4 justify-between sm:justify-end">
                                                    <span className="font-bold text-red-600 text-sm">- {cn.amount}</span>
                                                    <Button variant="ghost" size="sm" className="h-7 text-xs">View</Button>
                                                </div>
                                            </div>
                                        ))}
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
