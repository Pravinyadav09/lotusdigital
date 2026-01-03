"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGeofence, Geofence } from "@/providers/geofence-provider";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const OSMMap = dynamic(() => import("@/components/maps/osm-map"), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-lg flex items-center justify-center">Loading Interactive Map...</div>
});

export function GeofenceManager() {
    const { geofences, addGeofence, updateGeofence, deleteGeofence } = useGeofence();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.2090]);
    const [newGf, setNewGf] = useState<Omit<Geofence, "id">>({
        name: "",
        description: "",
        lat: 28.6139,
        lng: 77.2090,
        radius: 500,
        isActive: true,
        type: "Customer"
    });

    const handleAdd = () => {
        addGeofence(newGf);
        setIsAddOpen(false);
        setNewGf({
            name: "",
            description: "",
            lat: 28.6139,
            lng: 77.2090,
            radius: 500,
            isActive: true,
            type: "Customer"
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold tracking-tight">Safe Zones & Geofences</h3>
                    <p className="text-sm text-muted-foreground">Define business perimeters for automated site verification.</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 h-9 transition-all">
                            <Icons.add className="mr-2 h-4 w-4" />
                            Define New Area
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create Geofence Activity Zone</DialogTitle>
                            <DialogDescription>
                                Set coordinates and radius for automated check-in verification.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Area Name</Label>
                                <Input id="name" placeholder="e.g. Pixel Printers Okhla" value={newGf.name} onChange={e => setNewGf({ ...newGf, name: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Type</Label>
                                <Select value={newGf.type} onValueChange={(v: any) => setNewGf({ ...newGf, type: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Customer">Customer Site</SelectItem>
                                        <SelectItem value="Office">Office / HQ</SelectItem>
                                        <SelectItem value="Service Center">Service Hub</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Latitude</Label>
                                    <Input type="number" step="0.0001" value={newGf.lat} onChange={e => setNewGf({ ...newGf, lat: Number(e.target.value) })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Longitude</Label>
                                    <Input type="number" step="0.0001" value={newGf.lng} onChange={e => setNewGf({ ...newGf, lng: Number(e.target.value) })} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Verification Radius (Meters)</Label>
                                <div className="flex items-center gap-4">
                                    <Input type="number" value={newGf.radius} onChange={e => setNewGf({ ...newGf, radius: Number(e.target.value) })} />
                                    <Badge variant="secondary" className="whitespace-nowrap h-9 px-4">{newGf.radius}m</Badge>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                            <Button onClick={handleAdd} disabled={!newGf.name}>Create Perimeter</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-blue-100/50 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-sm">Geofence Visualizer</CardTitle>
                    <CardDescription>Live preview of defined perimeters on OpenStreetMap.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <OSMMap
                        center={mapCenter}
                        geofences={geofences}
                        height="400px"
                        onMarkerClick={(id) => {
                            const gf = geofences.find(g => g.id === id);
                            if (gf) toast.info(`Selected: ${gf.name}`);
                        }}
                        onMapClick={(lat, lng) => {
                            if (!isAddOpen) {
                                setIsAddOpen(true);
                            }
                            setNewGf(prev => ({ ...prev, lat, lng }));
                            toast.success(`Coordinates updated from map selection.`);
                        }}
                    />
                </CardContent>
            </Card>

            <Card className="border-blue-100/50 shadow-sm">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-muted/30">
                                    <TableHead className="w-[200px] font-bold">Zone Name</TableHead>
                                    <TableHead className="font-bold">Coordinates</TableHead>
                                    <TableHead className="font-bold">Radius</TableHead>
                                    <TableHead className="font-bold text-center">Status</TableHead>
                                    <TableHead className="text-right font-bold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {geofences.map((gf) => (
                                    <TableRow key={gf.id} className="hover:bg-muted/20 transition-colors">
                                        <TableCell>
                                            <div className="font-medium">{gf.name}</div>
                                            <div className="text-[10px] text-muted-foreground uppercase font-bold">{gf.type}</div>
                                        </TableCell>
                                        <TableCell className="text-[10px] font-mono whitespace-nowrap">
                                            {gf.lat.toFixed(4)}, {gf.lng.toFixed(4)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-blue-100 bg-blue-50/30 font-mono">{gf.radius}m</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Switch
                                                checked={gf.isActive}
                                                onCheckedChange={(v) => updateGeofence(gf.id, { isActive: v })}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                                                    onClick={() => {
                                                        setMapCenter([gf.lat, gf.lng]);
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        toast.success(`Focused on ${gf.name}`);
                                                    }}
                                                >
                                                    <Icons.location className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => deleteGeofence(gf.id)}>
                                                    <Icons.delete className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {geofences.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            No active geofences defined.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <Card className="bg-blue-50/20 border-blue-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs uppercase text-muted-foreground font-bold">Total Active Zones</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-700">{geofences.filter(g => g.isActive).length}</div>
                        <p className="text-[10px] text-blue-600 mt-1">Live across all regions</p>
                    </CardContent>
                </Card>
                <Card className="bg-green-50/20 border-green-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs uppercase text-muted-foreground font-bold">Avg. Verification Accuracy</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700">98.2%</div>
                        <p className="text-[10px] text-green-600 mt-1">± 8m GPS Precision</p>
                    </CardContent>
                </Card>
                <Card className="bg-amber-50/20 border-amber-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs uppercase text-muted-foreground font-bold">Integrity Level</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-700">High Protocol</div>
                        <p className="text-[10px] text-amber-600 mt-1">Anti-Spoofing Active</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-amber-100/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-wider">Recent Verification Audit</CardTitle>
                    <CardDescription>Live feed of geo-validated check-ins from the field.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30">
                                    <TableHead className="font-bold">Timestamp</TableHead>
                                    <TableHead className="font-bold">Rep / Site</TableHead>
                                    <TableHead className="font-bold">Status</TableHead>
                                    <TableHead className="text-right font-bold">Deviation</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {useGeofence().visitLogs.slice(0, 5).map((log) => (
                                    <TableRow key={log.id} className="text-xs">
                                        <TableCell className="font-mono text-[10px]">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-bold">Field User</div>
                                            <div className="text-[10px] text-muted-foreground">{log.visitId}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={log.status === 'verified' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}>
                                                {log.status.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-blue-600 font-bold">
                                            {log.distance}m
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {useGeofence().visitLogs.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-20 text-center text-muted-foreground italic">
                                            No recent activity logs found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
