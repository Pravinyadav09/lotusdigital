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
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">GST Compliance Dashboard</h2>
                    <p className="text-muted-foreground">GST Analytics, GSTR-1 Prep, and Tax Liabilities.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => toast.success("GSTR-1 JSON generated and downloading...")}>
                        <Icons.reports className="mr-2 h-4 w-4" />
                        Download GSTR-1 JSON
                    </Button>
                    <Button onClick={() => {
                        toast.info("Preparing GST Summary for print...");
                        window.print();
                    }}>
                        <Icons.printer className="mr-2 h-4 w-4" />
                        Print Summary
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-green-100 bg-green-50/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Output GST (Total)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700">₹ 4,30,500</div>
                        <p className="text-xs text-muted-foreground">Current Month (May 2024)</p>
                    </CardContent>
                </Card>
                <Card className="border-blue-100 bg-blue-50/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">ITC Available (Input)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-700">₹ 2,10,000</div>
                        <p className="text-xs text-muted-foreground">Based on purchase GSTR-2B</p>
                    </CardContent>
                </Card>
                <Card className="border-red-100 bg-red-50/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Net Tax Payable</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-700">₹ 2,20,500</div>
                        <p className="text-xs text-muted-foreground">Due by 20th of next month</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="gstr1" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="gstr1">B2B (GSTR-1)</TabsTrigger>
                    <TabsTrigger value="hsn">HSN Summary</TabsTrigger>
                    <TabsTrigger value="b2c">B2C Small</TabsTrigger>
                </TabsList>

                <TabsContent value="gstr1">
                    <Card>
                        <CardHeader>
                            <CardTitle>B2B Invoices (Registered Customers)</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>GSTIN</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Inv #</TableHead>
                                        <TableHead>Taxable Val</TableHead>
                                        <TableHead>IGST</TableHead>
                                        <TableHead>CGST/SGST</TableHead>
                                        <TableHead className="text-right">Total GST</TableHead>
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
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="hsn">
                    <Card>
                        <CardHeader>
                            <CardTitle>HSN/SAC Code Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>HSN/SAC</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>UOM</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead className="text-right">Total Tax</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-mono">8443</TableCell>
                                        <TableCell>Printing Machinery (Inkjet)</TableCell>
                                        <TableCell>NOS</TableCell>
                                        <TableCell>4</TableCell>
                                        <TableCell className="text-right">₹ 6,10,000</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-mono">9987</TableCell>
                                        <TableCell>Installation & Training Services</TableCell>
                                        <TableCell>OTH</TableCell>
                                        <TableCell>5</TableCell>
                                        <TableCell className="text-right">₹ 45,000</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
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
