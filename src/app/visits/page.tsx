"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import { Progress } from "@/components/ui/progress";

const MOCK_VISITS = [
    {
        id: "V-201",
        customer: "Pixel Printers",
        location: "Okhla Phase III, New Delhi",
        targetLat: 28.5355,
        targetLng: 77.2732,
        time: "10:30 AM",
        type: "Installation",
        status: "planned"
    },
    {
        id: "V-202",
        customer: "Sharma Graphics",
        location: "Naraina Industrial Area, Delhi",
        targetLat: 28.6276,
        targetLng: 77.1354,
        time: "02:00 PM",
        type: "Repair",
        status: "planned"
    },
    {
        id: "V-203",
        customer: "Super Flex",
        location: "Sector 62, Noida",
        targetLat: 28.622,
        targetLng: 77.361,
        time: "04:30 PM",
        type: "Maintenance",
        status: "planned"
    }
];

export default function VisitsPage() {
    const { user } = useAuth();
    const [visits, setVisits] = useState(MOCK_VISITS);
    const [isCheckingIn, setIsCheckingIn] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    const handleCheckIn = (visitId: string) => {
        setIsCheckingIn(visitId);
        setProgress(0);

        // Simulate GPS Radius Validation
        let interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 20;
            });
        }, 300);

        setTimeout(() => {
            const isWithinRadius = Math.random() > 0.2; // 80% chance of success for demo

            if (isWithinRadius) {
                toast.success("GPS Verified: You are within 500m of the site. Check-in successful.");
                setVisits(prev => prev.map(v => v.id === visitId ? { ...v, status: 'checked-in' } : v));
            } else {
                toast.error("GPS Fail: You are currently 1.2km away from the site. Check-in blocked.");
            }
            setIsCheckingIn(null);
        }, 1800);
    };

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Daily Visits & Check-ins</h2>
                    <p className="text-muted-foreground">Manage your field schedule with Geo-verification.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                        Online: GPS Active
                    </Badge>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visits.map((visit) => (
                    <Card key={visit.id} className={visit.status === 'checked-in' ? 'border-green-200 bg-green-50/20' : ''}>
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <Badge variant="secondary">{visit.type}</Badge>
                                {visit.status === 'checked-in' ? (
                                    <Badge className="bg-green-600">CHECKED IN</Badge>
                                ) : (
                                    <p className="text-xs font-bold text-blue-600">{visit.time}</p>
                                )}
                            </div>
                            <CardTitle className="mt-2">{visit.customer}</CardTitle>
                            <CardDescription className="flex items-center gap-1">
                                <Icons.location className="h-3 w-3" />
                                {visit.location}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isCheckingIn === visit.id ? (
                                <div className="space-y-2">
                                    <p className="text-[10px] text-center font-bold animate-pulse">VERIFYING GPS RADIUS...</p>
                                    <Progress value={progress} className="h-2" />
                                </div>
                            ) : visit.status === 'checked-in' ? (
                                <div className="space-y-3">
                                    <div className="p-2 rounded bg-white border border-green-100 flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Timestamp:</span>
                                        <span className="font-mono">{new Date().toLocaleTimeString()}</span>
                                    </div>
                                    <div className="p-2 rounded bg-white border border-green-100 flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Coordinates:</span>
                                        <span className="font-mono">28.53, 77.27 (Acc: 12m)</span>
                                    </div>
                                    <Button className="w-full bg-green-600" onClick={() => toast.success("Opening Visit Summary form...")}>
                                        <Icons.add className="mr-2 h-4 w-4" />
                                        Add Visit Note
                                    </Button>
                                    <Button variant="outline" className="w-full" onClick={() => {
                                        setVisits(prev => prev.map(v => v.id === visit.id ? { ...v, status: 'planned' } : v));
                                        toast.success("Checked out! Visit data synced.");
                                    }}>
                                        Checkout
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => toast.info(`Opening Google Maps for ${visit.location}`)}>
                                        <Icons.view className="mr-2 h-4 w-4" />
                                        Navigate
                                    </Button>
                                    <Button className="bg-blue-600" onClick={() => handleCheckIn(visit.id)}>
                                        Check-in
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}

                <Card className="border-dashed flex items-center justify-center p-6 bg-muted/20">
                    <div className="text-center">
                        <Icons.add className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm font-medium text-muted-foreground">Plan Future Visit</p>
                        <Button variant="link" className="text-xs" onClick={() => toast.info("Opening Field Calendar...")}>Open Calendar</Button>
                    </div>
                </Card>
            </div>

            <div className="p-4 border rounded-lg bg-blue-50/30 flex items-start gap-3">
                <Icons.warning className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-sm font-bold text-blue-900">Offline Awareness Mode</p>
                    <p className="text-xs text-blue-700">
                        If you lose connectivity, you can still perform 'Check-in'. The visit will be saved locally with its timestamp and GPS coordinates. It will auto-sync once you are back in a 4G/WiFi zone.
                    </p>
                </div>
            </div>
        </div>
    );
}
