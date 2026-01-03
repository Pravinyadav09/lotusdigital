"use client";

import { useAuth } from "@/providers/auth-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CATALOG_DATA = {
    machines: [
        { id: "M1", name: "Lotus Max 5000", type: "Inkjet", basePrice: 1200000, hsn: "8443", status: "Active" },
        { id: "M2", name: "Lotus Pro 2000", type: "Laser", basePrice: 850000, hsn: "8456", status: "Active" },
        { id: "M3", name: "Lotus Hybrid X1", type: "Hybrid", basePrice: 1550000, hsn: "8443", status: "Review" },
    ],
    heads: [
        { id: "H1", name: "Konica 512i", resolution: "30pl", price: 45000, status: "In-Stock" },
        { id: "H2", name: "Konica 1024i", resolution: "13pl", price: 85000, status: "Low-Stock" },
        { id: "H3", name: "Ricoh Gen5", resolution: "7pl", price: 110000, status: "Special Order" },
    ],
    accessories: [
        { id: "A1", name: "Extra Take-up Roller", price: 25000, category: "Hardware" },
        { id: "A2", name: "UV Curing Lamp Kit", price: 95000, category: "Add-on" },
        { id: "A3", name: "External Dryer Fan", price: 15000, category: "Hardware" },
    ]
}

export default function CatalogPage() {
    const { user } = useAuth();

    if (user?.role !== "super_admin") {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle className="text-red-600">Access Denied</CardTitle>
                        <CardDescription>Only Super Admins can manage the Master Price Catalog.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => window.history.back()}>Go Back</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl md:text-3xl font-bold tracking-tight">Master Price Catalog</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">Configure global base prices and component rates.</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => toast.info("Exporting Master Price List...")}>
                        <Icons.reports className="mr-2 h-4 w-4" />
                        Export PDF
                    </Button>
                    <Button className="bg-primary flex-1 sm:flex-none">
                        <Icons.add className="mr-2 h-4 w-4" />
                        Add New Item
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="machines" className="space-y-6">
                <TabsList className="w-full flex h-auto overflow-x-auto bg-muted p-1 rounded-lg justify-start">
                    <TabsTrigger value="machines" className="flex-1 py-2 text-xs sm:text-sm">Machines</TabsTrigger>
                    <TabsTrigger value="heads" className="flex-1 py-2 text-xs sm:text-sm">Printheads</TabsTrigger>
                    <TabsTrigger value="accessories" className="flex-1 py-2 text-xs sm:text-sm">Accessories</TabsTrigger>
                </TabsList>

                <TabsContent value="machines">
                    <Card>
                        <CardContent className="pt-6 p-0 md:p-6">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="min-w-[100px]">Model ID</TableHead>
                                            <TableHead className="min-w-[180px]">Name</TableHead>
                                            <TableHead className="min-w-[100px]">Type</TableHead>
                                            <TableHead className="min-w-[100px]">HSN Code</TableHead>
                                            <TableHead className="text-right min-w-[120px]">Base Price (₹)</TableHead>
                                            <TableHead className="min-w-[100px]">Status</TableHead>
                                            <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {CATALOG_DATA.machines.map((m) => (
                                            <TableRow key={m.id}>
                                                <TableCell className="font-mono text-xs">{m.id}</TableCell>
                                                <TableCell className="font-bold">{m.name}</TableCell>
                                                <TableCell>{m.type}</TableCell>
                                                <TableCell>{m.hsn}</TableCell>
                                                <TableCell className="text-right font-medium">{m.basePrice.toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Badge variant={m.status === 'Active' ? 'default' : 'outline'} className={m.status === 'Active' ? 'bg-green-600' : ''}>
                                                        {m.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" onClick={() => toast.info(`Editing ${m.name}...`)}>
                                                        <Icons.settings className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="heads">
                    <Card>
                        <CardContent className="pt-6 p-0 md:p-6">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="min-w-[100px]">Head ID</TableHead>
                                            <TableHead className="min-w-[180px]">Name</TableHead>
                                            <TableHead className="min-w-[120px]">Resolution</TableHead>
                                            <TableHead className="text-right min-w-[120px]">Unit Price (₹)</TableHead>
                                            <TableHead className="min-w-[120px]">Inventory</TableHead>
                                            <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {CATALOG_DATA.heads.map((h) => (
                                            <TableRow key={h.id}>
                                                <TableCell className="font-mono text-xs">{h.id}</TableCell>
                                                <TableCell className="font-bold">{h.name}</TableCell>
                                                <TableCell>{h.resolution}</TableCell>
                                                <TableCell className="text-right font-medium">{h.price.toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={h.status === 'In-Stock' ? 'text-green-600 border-green-200' : 'text-orange-600 border-orange-200'}>
                                                        {h.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm">
                                                        <Icons.settings className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="accessories">
                    <Card>
                        <CardContent className="pt-6 p-0 md:p-6">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="min-w-[100px]">Part ID</TableHead>
                                            <TableHead className="min-w-[200px]">Name</TableHead>
                                            <TableHead className="min-w-[120px]">Category</TableHead>
                                            <TableHead className="text-right min-w-[120px]">Price (₹)</TableHead>
                                            <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {CATALOG_DATA.accessories.map((a) => (
                                            <TableRow key={a.id}>
                                                <TableCell className="font-mono text-xs">{a.id}</TableCell>
                                                <TableCell className="font-bold">{a.name}</TableCell>
                                                <TableCell>{a.category}</TableCell>
                                                <TableCell className="text-right font-medium">{a.price.toLocaleString()}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm">
                                                        <Icons.settings className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex gap-3">
                    <Icons.warning className="h-5 w-5 text-amber-600 shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-amber-900">Important Note on Pricing</p>
                        <p className="text-xs text-amber-800">
                            Updates to the Master Catalog do not affect already "Approved" or "Frozen" quotations. New prices will only apply to drafts created after the update.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
