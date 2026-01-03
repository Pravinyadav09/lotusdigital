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
    const [models, setModels] = useState(INITIAL_MODELS);
    const [printheads, setPrintheads] = useState(INITIAL_PRINTHEADS);
    const [accessories, setAccessories] = useState(INITIAL_ACCESSORIES);

    // Form States
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("models");
    const [newItem, setNewItem] = useState<any>({});
    const [editingItem, setEditingItem] = useState<any>(null);

    if (user?.role !== "super_admin") {
        return (
            <div className="flex-1 p-8 text-center text-muted-foreground">
                Access Denied. Admin privileges required.
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

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Product Catalog</h2>
                    <p className="text-muted-foreground">Manage machines, parts, and pricing configuration.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => {
                            toast.promise(new Promise(r => setTimeout(r, 2000)), {
                                loading: 'Recalculating Global Price Index...',
                                success: 'Bulk Update Success: All models adjusted by +2% for supply chain fluctuation.',
                                error: 'Update Failed'
                            });
                        }}>
                            <Icons.accounting className="mr-2 h-4 w-4" />
                            Bulk Price Adjust
                        </Button>
                        <Button>
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

            <Tabs defaultValue="models" onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="models">Machine Models</TabsTrigger>
                    <TabsTrigger value="printheads">Printheads</TabsTrigger>
                    <TabsTrigger value="accessories">Accessories & Services</TabsTrigger>
                </TabsList>

                <TabsContent value="models" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Machine Base Models</CardTitle>
                            <CardDescription>Core printer models and base chassis pricing.</CardDescription>
                        </CardHeader>
                        <CardContent>
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
                                    {models.map((model) => (
                                        <TableRow key={model.id}>
                                            <TableCell className="font-medium">{model.name}</TableCell>
                                            <TableCell>₹ {model.basePrice.toLocaleString()}</TableCell>
                                            <TableCell>{model.hsn}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="sm" onClick={() => { setEditingItem(model); setIsEditOpen(true); }}>
                                                        <Icons.settings className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(model.id, 'model')}>
                                                        <Icons.delete className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="printheads" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Printhead Options</CardTitle>
                            <CardDescription>Available printhead configurations and pricing.</CardDescription>
                        </CardHeader>
                        <CardContent>
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
                                    {printheads.map((ph) => (
                                        <TableRow key={ph.id}>
                                            <TableCell className="font-medium">{ph.name}</TableCell>
                                            <TableCell>₹ {ph.pricePerHead.toLocaleString()}</TableCell>
                                            <TableCell>{ph.description}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="sm" onClick={() => { setEditingItem(ph); setIsEditOpen(true); }}>
                                                        <Icons.settings className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(ph.id, 'printhead')}>
                                                        <Icons.delete className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="accessories" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Accessories & Services</CardTitle>
                            <CardDescription>Add-ons, heaters, software, and services.</CardDescription>
                        </CardHeader>
                        <CardContent>
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
                                    {accessories.map((acc) => (
                                        <TableRow key={acc.id}>
                                            <TableCell className="font-medium">{acc.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{acc.type}</Badge>
                                            </TableCell>
                                            <TableCell>₹ {acc.price.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="sm" onClick={() => { setEditingItem(acc); setIsEditOpen(true); }}>
                                                        <Icons.settings className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(acc.id, 'accessory')}>
                                                        <Icons.delete className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
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
