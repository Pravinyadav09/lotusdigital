"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useCatalog } from "@/providers/catalog-provider"; // Import Context Hook
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CatalogPage() {
    const { user } = useAuth();
    const { machines, heads, accessories, addMachine, addHead, addAccessory } = useCatalog(); // Use Global State
    const [activeTab, setActiveTab] = useState("machines");

    // State for Dialog
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newItem, setNewItem] = useState<any>({});

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!newItem.name || !newItem.price) {
            toast.error("Please fill in all required fields (Name and Price).");
            return;
        }

        const price = Number(newItem.price);
        if (isNaN(price) || price <= 0) {
            toast.error("Please enter a valid positive price.");
            return;
        }

        const timestampId = Date.now().toString().slice(-4);

        if (activeTab === "machines") {
            addMachine({
                id: `M-NEW-${timestampId}`,
                name: newItem.name,
                type: newItem.type || "Inkjet",
                basePrice: price,
                hsn: newItem.hsn || "8443",
                status: "Active"
            });
        } else if (activeTab === "heads") {
            addHead({
                id: `H-NEW-${timestampId}`,
                name: newItem.name,
                resolution: newItem.resolution || "14pl",
                price: price,
                status: "In-Stock"
            });
        } else {
            addAccessory({
                id: `A-NEW-${timestampId}`,
                name: newItem.name,
                category: newItem.category || "General",
                price: price,
                status: "Active"
            });
        }

        toast.success(`${newItem.name} added to ${activeTab} catalog.`);
        setIsAddOpen(false);
        setNewItem({});
    };

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

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary flex-1 sm:flex-none">
                                <Icons.add className="mr-2 h-4 w-4" />
                                Add New Item
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="capitalize">Add New {activeTab.slice(0, -1)}</DialogTitle>
                                <DialogDescription>
                                    Add a new item to the {activeTab} master catalog.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddItem} className="space-y-4 py-4">
                                <div className="grid gap-2">
                                    <Label>Item Name</Label>
                                    <Input
                                        required
                                        placeholder={`e.g. Lotus ${activeTab === 'machines' ? 'Grand' : activeTab === 'heads' ? 'Head X1' : 'Roller'}`}
                                        value={newItem.name || ''}
                                        onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Price (₹)</Label>
                                    <Input
                                        required
                                        type="number"
                                        placeholder="0.00"
                                        value={newItem.price || ''}
                                        onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                                    />
                                </div>

                                {activeTab === 'machines' && (
                                    <>
                                        <div className="grid gap-2">
                                            <Label>Tech Type</Label>
                                            <Select onValueChange={v => setNewItem({ ...newItem, type: v })}>
                                                <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Inkjet">Inkjet</SelectItem>
                                                    <SelectItem value="Laser">Laser</SelectItem>
                                                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                                                    <SelectItem value="UV">UV Flatbed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>HSN Code</Label>
                                            <Input
                                                placeholder="8443 / 8456"
                                                value={newItem.hsn || ''}
                                                onChange={e => setNewItem({ ...newItem, hsn: e.target.value })}
                                            />
                                        </div>
                                    </>
                                )}

                                {activeTab === 'heads' && (
                                    <div className="grid gap-2">
                                        <Label>Resolution / Droplet Size</Label>
                                        <Input
                                            placeholder="e.g. 14pl, 30pl, 1200dpi"
                                            value={newItem.resolution || ''}
                                            onChange={e => setNewItem({ ...newItem, resolution: e.target.value })}
                                        />
                                    </div>
                                )}

                                {activeTab === 'accessories' && (
                                    <div className="grid gap-2">
                                        <Label>Category</Label>
                                        <Select onValueChange={v => setNewItem({ ...newItem, category: v })}>
                                            <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Hardware">Hardware</SelectItem>
                                                <SelectItem value="Add-on">Add-on</SelectItem>
                                                <SelectItem value="Consumable">Consumable</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <DialogFooter>
                                    <Button type="submit">Add Item</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
                                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                                            <TableHead className="min-w-[100px] font-bold">Model ID</TableHead>
                                            <TableHead className="min-w-[180px] font-bold">Model Name</TableHead>
                                            <TableHead className="min-w-[100px] font-bold">Tech Type</TableHead>
                                            <TableHead className="min-w-[100px] font-bold">HSN Code</TableHead>
                                            <TableHead className="text-right min-w-[130px] font-bold">Base Price (₹)</TableHead>
                                            <TableHead className="min-w-[100px] font-bold">Status</TableHead>
                                            <TableHead className="text-right min-w-[80px] font-bold">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {machines.map((m) => (
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
                                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                                            <TableHead className="min-w-[100px] font-bold">Head ID</TableHead>
                                            <TableHead className="min-w-[180px] font-bold">Component Name</TableHead>
                                            <TableHead className="min-w-[120px] font-bold">Resolution</TableHead>
                                            <TableHead className="text-right min-w-[130px] font-bold">Unit Price (₹)</TableHead>
                                            <TableHead className="min-w-[120px] font-bold">Inventory State</TableHead>
                                            <TableHead className="text-right min-w-[80px] font-bold">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {heads.map((h) => (
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
                                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                                            <TableHead className="min-w-[100px] font-bold">Part ID</TableHead>
                                            <TableHead className="min-w-[200px] font-bold">Part Name</TableHead>
                                            <TableHead className="min-w-[120px] font-bold">Category</TableHead>
                                            <TableHead className="text-right min-w-[130px] font-bold">Price (₹)</TableHead>
                                            <TableHead className="text-right min-w-[80px] font-bold">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {accessories.map((a) => (
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
