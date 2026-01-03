"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import { Progress } from "@/components/ui/progress";
import { ScheduleVisitDialog } from "@/components/visits/schedule-visit-dialog";
import { useGeofence } from "@/providers/geofence-provider";
import dynamic from "next/dynamic";

const OSMMap = dynamic(() => import("@/components/maps/osm-map"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-lg flex items-center justify-center">Loading Field Map...</div>
});

const MOCK_VISITS = [
    { id: "V-201", rep: "Rahul Singh", customer: "Pixel Printers", location: "Okhla Phase III, New Delhi", targetLat: 28.5355, targetLng: 77.2732, time: "10:30 AM", type: "Installation", status: "planned" },
    { id: "V-202", rep: "Amit Kumar", customer: "Sharma Graphics", location: "Naraina Industrial Area, Delhi", targetLat: 28.6276, targetLng: 77.1354, time: "02:00 PM", type: "Repair", status: "planned" },
    { id: "V-203", rep: "Rahul Singh", customer: "Super Flex", location: "Sector 62, Noida", targetLat: 28.622, targetLng: 77.361, time: "04:30 PM", type: "Maintenance", status: "planned" },
    { id: "V-204", rep: "Neha Sharma", customer: "Lotus Press", location: "Manesar, Haryana", targetLat: 28.3, targetLng: 76.9, time: "11:00 AM", type: "Demo", status: "checked-in" },
];

export default function VisitsPage() {
    const { user } = useAuth();
    const { verifyLocation, logVisit, geofences } = useGeofence();
    const isManager = user?.role === "super_admin" || user?.role === "sales_manager";
    const [visits, setVisits] = useState(MOCK_VISITS);
    const [isCheckingIn, setIsCheckingIn] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [showMap, setShowMap] = useState(true);

    const filteredVisits = isManager ? visits : visits.filter(v => v.rep === user?.name);

    const handleCheckIn = async (visit: any) => {
        setIsCheckingIn(visit.id);
        setProgress(0);

        // Progress simulation
        let progressVal = 0;
        const interval = setInterval(() => {
            progressVal += 10;
            setProgress(progressVal);
            if (progressVal >= 90) clearInterval(interval);
        }, 150);

        try {
            // Find if there's an associated geofence or use visit coordinates
            const targetLat = visit.targetLat;
            const targetLng = visit.targetLng;
            // Default 500m radius if not specified
            const radius = 500;

            const result = await verifyLocation(targetLat, targetLng, radius);

            setProgress(100);
            setTimeout(() => {
                if (result.success) {
                    toast.success(`GPS Verified: You are within ${result.distance}m. Check-in successful.`);
                    setVisits(prev => prev.map(v => v.id === visit.id ? { ...v, status: 'checked-in' } : v));

                    logVisit({
                        visitId: visit.id,
                        geofenceId: "MANUAL", // Or linked GF ID
                        timestamp: new Date().toISOString(),
                        status: "verified",
                        distance: result.distance,
                        coordinates: { lat: targetLat, lng: targetLng }
                    });
                } else {
                    toast.error(`GPS Fail: You are ${result.distance}m away. Minimum required: ${radius}m.`);
                    logVisit({
                        visitId: visit.id,
                        geofenceId: "MANUAL",
                        timestamp: new Date().toISOString(),
                        status: "failed",
                        distance: result.distance,
                        coordinates: { lat: targetLat, lng: targetLng }
                    });
                }
                setIsCheckingIn(null);
            }, 500);
        } catch (error) {
            toast.error("GPS Acquisition Failed. Please check device permissions.");
            setIsCheckingIn(null);
        }
    };

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl md:text-3xl font-bold tracking-tight">Daily Visits & Check-ins</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">Manage your field schedule with Geo-verification.</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        variant="outline"
                        size="sm"
                        className={showMap ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                        onClick={() => setShowMap(!showMap)}
                    >
                        <Icons.location className="mr-2 h-4 w-4" />
                        {showMap ? "Hide Map" : "Show Map"}
                    </Button>
                    <ScheduleVisitDialog />
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 py-1 text-[10px] sm:text-xs">
                        <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse shrink-0" />
                        <span className="truncate">Online: GPS Active</span>
                    </Badge>
                </div>
            </div>

            {showMap && (
                <Card className="border-blue-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-muted/30 py-3">
                        <CardTitle className="text-xs uppercase tracking-wider font-bold">Field Route Visualizer</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <OSMMap
                            center={[28.6139, 77.2090]}
                            zoom={10}
                            height="300px"
                            geofences={filteredVisits.map(v => ({
                                id: v.id,
                                name: v.customer,
                                lat: v.targetLat,
                                lng: v.targetLng,
                                radius: 500,
                                isActive: v.status === 'checked-in'
                            }))}
                        />
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVisits.map((visit) => (
                    <Card key={visit.id} className={visit.status === 'checked-in' ? 'border-green-200 bg-green-50/20 shadow-sm' : ''}>
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <Badge variant="secondary" className="capitalize">{visit.type}</Badge>
                                {visit.status === 'checked-in' ? (
                                    <Badge className="bg-green-600 animate-pulse">LIVE: CHECKED IN</Badge>
                                ) : (
                                    <p className="text-xs font-bold text-blue-600">{visit.time}</p>
                                )}
                            </div>
                            <CardTitle className="mt-2">{visit.customer}</CardTitle>
                            <CardDescription className="flex items-center gap-1">
                                <Icons.location className="h-3 w-3" />
                                {visit.location}
                            </CardDescription>
                            {isManager && (
                                <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">Field Rep: {visit.rep}</p>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isCheckingIn === visit.id ? (
                                <div className="space-y-2">
                                    <p className="text-[10px] text-center font-bold animate-pulse text-blue-600">ACQUIRING SATELLITE LOCK...</p>
                                    <Progress value={progress} className="h-2" />
                                    <p className="text-[8px] text-center text-muted-foreground">Validating precision within 5-10m radius</p>
                                </div>
                            ) : visit.status === 'checked-in' ? (
                                <div className="space-y-3 font-mono text-[10px]">
                                    <div className="p-2 rounded bg-white border border-green-100 flex items-center justify-between">
                                        <span className="text-muted-foreground uppercase">Verified At:</span>
                                        <span>{new Date().toLocaleTimeString()}</span>
                                    </div>
                                    <div className="p-2 rounded bg-white border border-green-100 flex items-center justify-between">
                                        <span className="text-muted-foreground uppercase">Stability:</span>
                                        <span className="text-green-600">EXCELLENT (GPS)</span>
                                    </div>
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => toast.success("Opening Visit Summary & Action Log...")}>
                                        <Icons.add className="mr-2 h-4 w-4" />
                                        Log Action Items
                                    </Button>
                                    <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50" onClick={() => {
                                        setVisits(prev => prev.map(v => v.id === visit.id ? { ...v, status: 'planned' } : v));
                                        toast.success("Checked out! Summary synced to Lead Activity.");
                                    }}>
                                        Complete Visit
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => toast.info(`Opening Satellite Navigation for ${visit.location}`)}>
                                        <Icons.view className="mr-2 h-4 w-4" />
                                        Route
                                    </Button>
                                    <Button className="bg-blue-600 hover:shadow-lg transition-all" onClick={() => handleCheckIn(visit)} disabled={isManager}>
                                        {isManager ? "Rep Only" : "Check-in"}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}

                {!isManager && (
                    <Card className="border-dashed flex items-center justify-center p-6 bg-muted/20 hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => toast.info("Opening Site Planner...")}>
                        <div className="text-center">
                            <Icons.add className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm font-medium text-muted-foreground">Add Planned Site</p>
                        </div>
                    </Card>
                )}
            </div>

            <div className="p-4 border rounded-lg bg-blue-50/30 flex items-start gap-3">
                <Icons.warning className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-sm font-bold text-blue-900">Geofencing Integrity</p>
                    <p className="text-xs text-blue-700 leading-relaxed">
                        Lotus Digital uses high-precision Geofencing. Check-ins are only permitted within the defined radius of a customer site. Manual overrides are flagged for manager review.
                    </p>
                </div>
            </div>
        </div>
    );
}
