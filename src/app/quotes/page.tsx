"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";

import { useAuth } from "@/providers/auth-provider";

const MOCK_QUOTES = [
    { id: "Q-2024-001", customer: "Pixel Printers", amount: 850000, date: "2024-05-01", status: "approved" },
    { id: "Q-2024-002", customer: "Sharma Graphics", amount: 450000, date: "2024-05-02", status: "draft" },
    { id: "Q-2024-003", customer: "Creative Ads", amount: 1250000, date: "2024-05-03", status: "pending_approval" },
    { id: "Q-2024-004", customer: "Lotus Digital Systems", amount: 650000, date: "2024-05-04", status: "rejected" },
];

export default function QuotesListPage() {
    const { user } = useAuth();

    // Permissions: Service Engineers don't see financial quotes
    const isServiceEngineer = user?.role === "service_engineer";
    const isCustomer = user?.role === "customer";

    const filteredQuotes = MOCK_QUOTES.filter(quote => {
        if (isCustomer) return quote.customer === user?.name;
        if (isServiceEngineer) return false;
        return true;
    });

    const canCreate = !isCustomer && !isServiceEngineer;

    if (isServiceEngineer) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Service Engineers do not have access to financial quotations.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Quotations</h2>
                    <p className="text-muted-foreground text-sm xl:text-base">
                        {isCustomer ? "Your machine quotations and orders" : "Manage sales quotes and approvals"}
                    </p>
                </div>
                {canCreate && (
                    <Link href="/quotes/create" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto">
                            <Icons.add className="mr-2 h-4 w-4" />
                            Create New Quote
                        </Button>
                    </Link>
                )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1 md:max-w-md">
                    <Icons.search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search quotes by ID or customer..."
                        className="pl-8 h-9"
                    />
                </div>
                <Button variant="outline" size="sm" className="h-9 gap-2">
                    <Icons.filter className="h-4 w-4" />
                    <span className="md:hidden lg:inline text-xs">Filter</span>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{isCustomer ? "Recent Quotations" : "All Quotations"}</CardTitle>
                    <CardDescription>
                        {isCustomer ? "Summary of your equipment purchase quotes." : "List of all generated quotations across the organization."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[120px]">Quote ID</TableHead>
                                    {!isCustomer && <TableHead className="min-w-[150px]">Customer</TableHead>}
                                    <TableHead className="min-w-[100px]">Date</TableHead>
                                    <TableHead className="min-w-[120px]">Amount</TableHead>
                                    <TableHead className="min-w-[120px]">Status</TableHead>
                                    <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredQuotes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                            No quotations found.
                                        </TableCell>
                                    </TableRow>
                                ) : filteredQuotes.map((quote) => (
                                    <TableRow key={quote.id}>
                                        <TableCell className="font-medium">{quote.id}</TableCell>
                                        {!isCustomer && <TableCell>{quote.customer}</TableCell>}
                                        <TableCell>{quote.date}</TableCell>
                                        <TableCell>₹{quote.amount.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    quote.status === "approved" ? "default" :
                                                        quote.status === "rejected" ? "destructive" :
                                                            quote.status === "draft" ? "secondary" : "outline"
                                                }
                                                className={
                                                    quote.status === "approved" ? "bg-green-600" :
                                                        quote.status === "pending_approval" ? "bg-amber-600 text-white" : ""
                                                }
                                            >
                                                {quote.status.replace("_", " ").toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/quotes/${quote.id}`}>
                                                <Button variant="ghost" size="icon">
                                                    <Icons.view className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div >
    );
}
