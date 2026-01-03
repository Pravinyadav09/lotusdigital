"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function GSTReportsPage() {
    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 h-full overflow-y-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">GST Compliance Dashboard</h2>
                    <p className="text-muted-foreground text-sm md:text-base">GST Analytics, GSTR-1 Prep, and Tax Liabilities.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="flex-1 md:flex-none text-xs h-9" onClick={() => toast.success("GSTR-1 JSON generated and downloading...")}>
                        <Icons.reports className="mr-2 h-4 w-4" />
                        Download GSTR-1 JSON
                    </Button>
                    <Button className="flex-1 md:flex-none text-xs h-9" onClick={() => {
                        toast.info("Preparing GST Summary for print...");
                        window.print();
                    }}>
                        <Icons.printer className="mr-2 h-4 w-4" />
                        Print Summary
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-green-100 bg-green-50/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Output GST (Total)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700">₹ 4,30,500</div>
                        <p className="text-xs text-muted-foreground text-green-600">↑ 12% vs last month</p>
                    </CardContent>
                </Card>
                <Card className="border-blue-100 bg-blue-50/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">ITC Available (Input)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-700">₹ 2,10,000</div>
                        <p className="text-xs text-muted-foreground">98% Reconciled with GSTR-2B</p>
                    </CardContent>
                </Card>
                <Card className="border-red-100 bg-red-50/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Net Tax Payable</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-700">₹ 2,20,500</div>
                        <p className="text-xs text-muted-foreground">Cash Ledger: ₹ 45,000</p>
                    </CardContent>
                </Card>
                <Card className="border-amber-100 bg-amber-50/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Filing Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-700">96.4%</div>
                        <p className="text-xs text-muted-foreground">2 Missing E-way Bills</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="gstr1" className="space-y-4">
                <TabsList className="w-full h-auto bg-muted p-1 rounded-lg flex overflow-x-auto whitespace-nowrap">
                    <TabsTrigger value="gstr1" className="flex-1 px-4 py-2">B2B (GSTR-1)</TabsTrigger>
                    <TabsTrigger value="hsn" className="flex-1 px-4 py-2">HSN Summary</TabsTrigger>
                    <TabsTrigger value="b2c" className="flex-1 px-4 py-2">B2C Small</TabsTrigger>
                </TabsList>

                <TabsContent value="gstr1">
                    <Card>
                        <CardHeader>
                            <CardTitle>B2B Invoices (Registered Customers)</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="min-w-[140px]">GSTIN</TableHead>
                                            <TableHead className="min-w-[180px]">Customer</TableHead>
                                            <TableHead className="min-w-[100px]">Inv #</TableHead>
                                            <TableHead className="min-w-[120px]">Taxable Val</TableHead>
                                            <TableHead className="min-w-[100px]">IGST</TableHead>
                                            <TableHead className="min-w-[120px]">CGST/SGST</TableHead>
                                            <TableHead className="text-right min-w-[120px]">Total GST</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="text-xs font-mono">07AAACP1234A1Z1</TableCell>
                                            <TableCell className="text-xs font-bold">Pixel Printers</TableCell>
                                            <TableCell className="text-xs">TI-2024-001</TableCell>
                                            <TableCell className="text-xs">₹ 8,50,000</TableCell>
                                            <TableCell className="text-xs">₹ 0</TableCell>
                                            <TableCell className="text-xs">₹ 76,500 x 2</TableCell>
                                            <TableCell className="text-right font-bold">₹ 1,53,000</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="text-xs font-mono">03BBBCP5678B1Z2</TableCell>
                                            <TableCell className="text-xs font-bold">Singh Graphics</TableCell>
                                            <TableCell className="text-xs">TI-2024-005</TableCell>
                                            <TableCell className="text-xs">₹ 12,50,000</TableCell>
                                            <TableCell className="text-xs">₹ 2,25,000</TableCell>
                                            <TableCell className="text-xs">₹ 0</TableCell>
                                            <TableCell className="text-right font-bold">₹ 2,25,000</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="hsn">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>HSN/SAC Code Summary</CardTitle>
                                <CardDescription>Consolidated view for Table 12 of GSTR-1.</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs text-blue-600" onClick={() => toast.info("Downloading detailed HSN drill-down (XLS)...")}>
                                <Icons.reports className="mr-2 h-3 w-3" />
                                Export Excel
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="min-w-[120px]">HSN/SAC</TableHead>
                                            <TableHead className="min-w-[200px]">Description</TableHead>
                                            <TableHead className="min-w-[80px]">UOM</TableHead>
                                            <TableHead className="min-w-[80px]">Quantity</TableHead>
                                            <TableHead className="min-w-[120px]">Taxable Val</TableHead>
                                            <TableHead className="text-right min-w-[120px]">Total Tax</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow className="cursor-pointer hover:bg-muted/30" onClick={() => toast.info("Opening breakdown for Printing Machinery...")}>
                                            <TableCell className="font-mono text-xs">84433210</TableCell>
                                            <TableCell className="text-xs">Inkjet Printing Machinery</TableCell>
                                            <TableCell className="text-xs">NOS</TableCell>
                                            <TableCell className="text-xs font-bold">4</TableCell>
                                            <TableCell className="text-xs">₹ 34,20,000</TableCell>
                                            <TableCell className="text-right font-bold text-green-700">₹ 6,15,600</TableCell>
                                        </TableRow>
                                        <TableRow className="cursor-pointer hover:bg-muted/30" onClick={() => toast.info("Opening breakdown for Services...")}>
                                            <TableCell className="font-mono text-xs">998733</TableCell>
                                            <TableCell className="text-xs">Maintenance & Repair Services</TableCell>
                                            <TableCell className="text-xs">OTH</TableCell>
                                            <TableCell className="text-xs font-bold">5</TableCell>
                                            <TableCell className="text-xs">₹ 2,50,000</TableCell>
                                            <TableCell className="text-right font-bold text-green-700">₹ 45,000</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="p-4 border rounded-lg bg-amber-50/20">
                <div className="flex items-center gap-2 mb-2">
                    <Icons.warning className="h-4 w-4 text-amber-600" />
                    <h4 className="text-sm font-bold">Filing Reminder</h4>
                </div>
                <p className="text-xs text-muted-foreground">
                    GSTR-1 for May 2024 is due by 11th June. Ensure all Proforma Invoices (PIs) are NOT included in this report as they are not tax-liable until a Tax Invoice is generated.
                </p>
            </div>
        </div>
    );
}
