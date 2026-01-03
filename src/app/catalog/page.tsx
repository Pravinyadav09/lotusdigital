"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";

// Mock Data Types
interface ProductModel {
    id: string;
    name: string;
    basePrice: number;
    hsn: string;
    category: "printer" | "spare" | "ink";
}

interface Printhead {
    id: string;
    name: string;
    pricePerHead: number;
    description: string;
}

interface Accessory {
    id: string;
    name: string;
    price: number;
    type: "hardware" | "software" | "service";
    hsn: string;
}

// Initial Data
const INITIAL_MODELS: ProductModel[] = [
    { id: "M1", name: "Konica 512i (30PL)", basePrice: 450000, hsn: "84433200", category: "printer" },
    { id: "M2", name: "Starfire 1024 (25PL)", basePrice: 850000, hsn: "84433200", category: "printer" },
    { id: "M3", name: "Epson i3200", basePrice: 550000, hsn: "84433200", category: "printer" },
];

const INITIAL_PRINTHEADS: Printhead[] = [
    { id: "PH1", name: "Konica 512i", pricePerHead: 45000, description: "Industrial heavy duty" },
    { id: "PH2", name: "Starfire 1024", pricePerHead: 125000, description: "High speed durable" },
    { id: "PH3", name: "Epson i3200", pricePerHead: 65000, description: "High resolution eco-solvent" },
];

const INITIAL_ACCESSORIES: Accessory[] = [
    { id: "A1", name: "Infrared Heater", price: 25000, type: "hardware", hsn: "8471" },
    { id: "A2", name: "RIP Software PC", price: 45000, type: "hardware", hsn: "8471" },
    { id: "A3", name: "Online UPS 3KVA", price: 35000, type: "hardware", hsn: "8504" },
    { id: "A4", name: "Installation & Training", price: 15000, type: "service", hsn: "9987" },
];

export default function CatalogPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [models, setModels] = useState(INITIAL_MODELS);
    const [printheads, setPrintheads] = useState(INITIAL_PRINTHEADS);
    const [accessories, setAccessories] = useState(INITIAL_ACCESSORIES);

    // Form States
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("models");
    const [newItem, setNewItem] = useState<any>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [editingItem, setEditingItem] = useState<any>(null);
    const [modelFilter, setModelFilter] = useState("all");

    if (user === null) {
        return (
            <div className="flex-1 flex items-center justify-center h-full text-muted-foreground animate-pulse">
                <Icons.logo className="mr-2 h-6 w-6 animate-spin" />
                Validating Catalog Credentials...
            </div>
        );
    }

    if (user.role !== "super_admin") {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 h-full">
                <Icons.warning className="h-12 w-12 text-amber-500" />
                <div className="space-y-2">
                    <h3 className="text-xl font-bold">Access Restricted</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        This section requires Super Admin privileges. Please contact the system administrator if you believe this is an error.
                    </p>
                </div>
                <Button variant="outline" onClick={() => router.push("/dashboard")}>Return to Safety</Button>
            </div>
        );
    }

    const handleAddItem = () => {
        if (activeTab === "models") {
            setModels([...models, { ...newItem, id: `M${models.length + 1}` }]);
        } else if (activeTab === "printheads") {
            setPrintheads([...printheads, { ...newItem, id: `PH${printheads.length + 1}` }]);
        } else {
            setAccessories([...accessories, { ...newItem, id: `A${accessories.length + 1}` }]);
        }
        toast.success("Item added successfully");
        setIsDialogOpen(false);
        setNewItem({});
    };

    const handleEditItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (activeTab === "models") {
            setModels(models.map(m => m.id === editingItem.id ? editingItem : m));
        } else if (activeTab === "printheads") {
            setPrintheads(printheads.map(p => p.id === editingItem.id ? editingItem : p));
        } else {
            setAccessories(accessories.map(a => a.id === editingItem.id ? editingItem : a));
        }
        toast.success("Item updated successfully");
        setIsEditOpen(false);
        setEditingItem(null);
    };

    const handleDelete = (id: string, type: string) => {
        if (type === "model") setModels(models.filter(m => m.id !== id));
        if (type === "printhead") setPrintheads(printheads.filter(p => p.id !== id));
        if (type === "accessory") setAccessories(accessories.filter(a => a.id !== id));
        toast.success("Item removed");
    };

    const filteredModels = models.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (modelFilter === "all" || m.category === modelFilter)
    );
    const filteredPrintheads = printheads.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredAccessories = accessories.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 h-full overflow-y-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Product Catalog</h2>
                    <p className="text-muted-foreground text-sm md:text-base">Manage machines, parts, and pricing configuration.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" className="w-full sm:w-auto" onClick={() => {
                        toast.promise(new Promise(r => setTimeout(r, 2000)), {
                            loading: 'Recalculating Global Price Index...',
                            success: 'Bulk Update Success: All models adjusted by +2% for supply chain fluctuation.',
                            error: 'Update Failed'
                        });
                    }}>
                        <Icons.accounting className="mr-2 h-4 w-4" />
                        Bulk Price Adjust
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto">
                                <Icons.add className="mr-2 h-4 w-4" />
                                Add New Item
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New {activeTab === "models" ? "Model" : activeTab === "printheads" ? "Printhead" : "Accessory"}</DialogTitle>
                                <DialogDescription>Enter details for the new catalog item.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                {activeTab === "models" && (
                                    <>
                                        <div className="grid gap-2">
                                            <Label>Model Name</Label>
                                            <Input onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Base Price (₹)</Label>
                                            <Input type="number" onChange={e => setNewItem({ ...newItem, basePrice: parseInt(e.target.value) })} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>HSN Code</Label>
                                            <Input defaultValue="84433200" onChange={e => setNewItem({ ...newItem, hsn: e.target.value })} />
                                        </div>
                                    </>
                                )}
                                {activeTab === "printheads" && (
                                    <>
                                        <div className="grid gap-2">
                                            <Label>Printhead Name</Label>
                                            <Input onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Price Per Head (₹)</Label>
                                            <Input type="number" onChange={e => setNewItem({ ...newItem, pricePerHead: parseInt(e.target.value) })} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Description</Label>
                                            <Input onChange={e => setNewItem({ ...newItem, description: e.target.value })} />
                                        </div>
                                    </>
                                )}
                                {activeTab === "accessories" && (
                                    <>
                                        <div className="grid gap-2">
                                            <Label>Item Name</Label>
                                            <Input onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Price (₹)</Label>
                                            <Input type="number" onChange={e => setNewItem({ ...newItem, price: parseInt(e.target.value) })} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Type</Label>
                                            <Input placeholder="hardware/software/service" onChange={e => setNewItem({ ...newItem, type: e.target.value })} />
                                        </div>
                                    </>
                                )}
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddItem}>Save Item</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="relative w-full md:max-w-sm">
                <Icons.search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search catalog..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <Tabs defaultValue="models" onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-muted/50">
                    <TabsTrigger value="models" className="flex-1 sm:flex-none">Machine Models</TabsTrigger>
                    <TabsTrigger value="printheads" className="flex-1 sm:flex-none">Printheads</TabsTrigger>
                    <TabsTrigger value="accessories" className="flex-1 sm:flex-none">Accessories & Services</TabsTrigger>
                </TabsList>

                <TabsContent value="models" className="space-y-4">
                    <Card>
                        <CardHeader className="pb-3 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-lg">Machine Base Models</CardTitle>
                                    <CardDescription className="text-xs">Core printer models and base chassis pricing.</CardDescription>
                                </div>
                                <div className="flex gap-1 overflow-x-auto pb-1">
                                    {["all", "printer", "spare", "ink"].map((cat) => (
                                        <Badge
                                            key={cat}
                                            variant={modelFilter === cat ? "default" : "outline"}
                                            className="cursor-pointer capitalize text-[10px]"
                                            onClick={() => setModelFilter(cat)}
                                        >
                                            {cat}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 sm:p-6">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Model Name</TableHead>
                                            <TableHead>Base Price</TableHead>
                                            <TableHead>HSN Code</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredModels.map((model) => (
                                            <TableRow key={model.id}>
                                                <TableCell className="font-medium whitespace-nowrap">{model.name}</TableCell>
                                                <TableCell className="whitespace-nowrap">₹ {model.basePrice.toLocaleString()}</TableCell>
                                                <TableCell className="whitespace-nowrap">{model.hsn}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingItem(model); setIsEditOpen(true); }}>
                                                            <Icons.settings className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(model.id, 'model')}>
                                                            <Icons.delete className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="printheads" className="space-y-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Printhead Options</CardTitle>
                            <CardDescription className="text-xs">Available printhead configurations and pricing.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 sm:p-6">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Price / Head</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPrintheads.map((ph) => (
                                            <TableRow key={ph.id}>
                                                <TableCell className="font-medium whitespace-nowrap">{ph.name}</TableCell>
                                                <TableCell className="whitespace-nowrap">₹ {ph.pricePerHead.toLocaleString()}</TableCell>
                                                <TableCell className="text-xs max-w-[200px] truncate">{ph.description}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingItem(ph); setIsEditOpen(true); }}>
                                                            <Icons.settings className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(ph.id, 'printhead')}>
                                                            <Icons.delete className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="accessories" className="space-y-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Accessories & Services</CardTitle>
                            <CardDescription className="text-xs">Add-ons, heaters, software, and services.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 sm:p-6">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Item</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredAccessories.map((acc) => (
                                            <TableRow key={acc.id}>
                                                <TableCell className="font-medium whitespace-nowrap">{acc.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-[10px] capitalize">{acc.type}</Badge>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap">₹ {acc.price.toLocaleString()}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingItem(acc); setIsEditOpen(true); }}>
                                                            <Icons.settings className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(acc.id, 'accessory')}>
                                                            <Icons.delete className="h-4 w-4" />
                                                        </Button>
                                                    </div>
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

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Catalog Item</DialogTitle>
                    </DialogHeader>
                    {editingItem && (
                        <div className="grid gap-4 py-4">
                            {activeTab === "models" && (
                                <>
                                    <div className="grid gap-2">
                                        <Label>Model Name</Label>
                                        <Input value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Base Price (₹)</Label>
                                        <Input type="number" value={editingItem.basePrice} onChange={e => setEditingItem({ ...editingItem, basePrice: parseInt(e.target.value) })} />
                                    </div>
                                </>
                            )}
                            {activeTab === "printheads" && (
                                <>
                                    <div className="grid gap-2">
                                        <Label>Printhead Name</Label>
                                        <Input value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Price (₹)</Label>
                                        <Input type="number" value={editingItem.pricePerHead} onChange={e => setEditingItem({ ...editingItem, pricePerHead: parseInt(e.target.value) })} />
                                    </div>
                                </>
                            )}
                            {activeTab === "accessories" && (
                                <>
                                    <div className="grid gap-2">
                                        <Label>Item Name</Label>
                                        <Input value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Price (₹)</Label>
                                        <Input type="number" value={editingItem.price} onChange={e => setEditingItem({ ...editingItem, price: parseInt(e.target.value) })} />
                                    </div>
                                </>
                            )}
                            <DialogFooter>
                                <Button onClick={handleEditItem}>Save Changes</Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
