"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export function VisitPlanningClient({ id }: { id: string }) {
    const router = useRouter();
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const [visitData, setVisitData] = useState({
        scheduledDate: new Date().toISOString().split('T')[0],
        scheduledTime: "10:00",
        notes: "",
        photos: [] as string[],
        gpsLat: null as number | null,
        gpsLng: null as number | null,
        checkedIn: false,
        completed: false,
        distance: null as number | null
    });

    const verifyRadius = (lat: number, lng: number) => {
        // Haversine approx (mocking site location nearby)
        // In real app, we compare with lead address lat/lng
        const distance = Math.floor(Math.random() * 800);
        return {
            success: distance <= 500,
            distance
        };
    };

    const handleCheckIn = () => {
        setIsCheckingIn(true);
        const isOffline = !navigator.onLine;

        toast.loading(isOffline ? "Offline Mode: Staging GPS Capture..." : "Verifying Proximity Integrity...", { id: "checkin" });

        setTimeout(() => {
            const mockLat = 28.5494 + (Math.random() - 0.5) * 0.002;
            const mockLng = 77.2501 + (Math.random() - 0.5) * 0.002;
            const verification = verifyRadius(mockLat, mockLng);

            if (verification.success) {
                setVisitData(prev => ({
                    ...prev,
                    gpsLat: mockLat,
                    gpsLng: mockLng,
                    distance: verification.distance,
                    checkedIn: true
                }));
                toast.success(`Check-in Verified! (${verification.distance}m from site).`, { id: "checkin" });
            } else {
                toast.error(`Verification Failed: You are ${verification.distance}m away. Must be within 500m.`, { id: "checkin" });
            }
            setIsCheckingIn(false);
        }, 1500);
    };

    const handleCompleteVisit = () => {
        if (!visitData.checkedIn) {
            toast.error("Security Block: Must verify GPS Check-in before closing visit logs.");
            return;
        }

        if (visitData.notes.length < 20) {
            toast.error("Please provide detailed meeting summary (min 20 chars).");
            return;
        }

        const isOffline = !navigator.onLine;
        toast.promise(
            new Promise(r => setTimeout(r, 1000)),
            {
                loading: isOffline ? 'Saving logs to local buffer...' : 'Syncing visit logs to head office...',
                success: () => {
                    setTimeout(() => router.push(`/leads/${id}`), 500);
                    return isOffline ? 'Saved! Logs will auto-sync when network returns.' : 'Visit logs synced successfully.';
                },
                error: 'Sync error'
            }
        );
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            toast.success(`${e.target.files.length} Requirement Photos attached.`);
        }
    };

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 h-full overflow-y-auto max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <Icons.arrowRight className="h-5 w-5 rotate-180" />
                    </Button>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Visit Execution</h2>
                        <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
                            Lead Ref: {id} •
                            {!navigator.onLine ? (
                                <Badge variant="destructive" className="h-4 text-[8px] animate-pulse">OFFLINE MODE ACTIVE</Badge>
                            ) : (
                                <Badge variant="outline" className="h-4 text-[8px] text-green-600 border-green-200">OPS CLOUD SYNCED</Badge>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* GPS Check-in */}
                    <Card className={visitData.checkedIn ? 'border-green-200 bg-green-50/10' : 'border-blue-100'}>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Icons.location className="h-5 w-5 text-blue-600" />
                                Proximity Verification
                            </CardTitle>
                            <CardDescription>Security requirement for field representatives.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!visitData.checkedIn ? (
                                <div className="p-8 border-2 border-dashed rounded-lg text-center space-y-4">
                                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                        <Icons.location className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-bold text-sm">Site Check-In Required</p>
                                        <p className="text-xs text-muted-foreground">Radius Rule: Under 500m from Registered Customer Address</p>
                                    </div>
                                    <Button
                                        onClick={handleCheckIn}
                                        disabled={isCheckingIn}
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                    >
                                        {isCheckingIn ? "Acquiring Coordinates..." : "Verify My Location"}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-white border border-green-200 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                                <Icons.check className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-green-700 uppercase">GPS Verified</p>
                                                <p className="text-[10px] text-muted-foreground font-mono">{visitData.gpsLat?.toFixed(6)}, {visitData.gpsLng?.toFixed(6)}</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-green-600 uppercase text-[9px]">Inside {visitData.distance}m</Badge>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Requirement Logging */}
                    <Card className={!visitData.checkedIn ? 'opacity-50 pointer-events-none' : ''}>
                        <CardHeader>
                            <CardTitle className="text-lg">Meeting Ground Notes</CardTitle>
                            <CardDescription>Detail-heavy requirements for Quotation Logic.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Meeting Summary & Action Items *</Label>
                                <Textarea
                                    placeholder="Discussed machine space, electrical requirements confirmed, interest in extra rollers..."
                                    rows={6}
                                    value={visitData.notes}
                                    onChange={e => setVisitData({ ...visitData, notes: e.target.value })}
                                />
                                <p className="text-[10px] text-muted-foreground italic">Min 20 characters required for submission.</p>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <Label>Requirement Photos (Machine Room, Current Setup)</Label>
                                <div className="flex items-center gap-4">
                                    <Button variant="outline" className="flex-1 h-20 border-2 border-dashed flex flex-col gap-1" onClick={() => document.getElementById('camera-up')?.click()}>
                                        <Icons.add className="h-6 w-6 text-muted-foreground" />
                                        <span className="text-xs">Take Photo</span>
                                    </Button>
                                    <Button variant="outline" className="flex-1 h-20 border-2 border-dashed flex flex-col gap-1" onClick={() => document.getElementById('gallery-up')?.click()}>
                                        <Icons.reports className="h-6 w-6 text-muted-foreground" />
                                        <span className="text-xs">Attach from Gallery</span>
                                    </Button>
                                    <input type="file" id="camera-up" capture="environment" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                                    <input type="file" id="gallery-up" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Visit Schedule</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-muted-foreground">Planned Date</Label>
                                <Input type="date" value={visitData.scheduledDate} onChange={e => setVisitData({ ...visitData, scheduledDate: e.target.value })} disabled={visitData.checkedIn} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-muted-foreground">Planned Time</Label>
                                <Input type="time" value={visitData.scheduledTime} onChange={e => setVisitData({ ...visitData, scheduledTime: e.target.value })} disabled={visitData.checkedIn} />
                            </div>
                        </CardContent>
                    </Card>

                    <Button
                        className="w-full h-14 bg-green-600 hover:bg-green-700 text-lg shadow-xl"
                        onClick={handleCompleteVisit}
                    >
                        <Icons.check className="mr-2 h-6 w-6" />
                        Finalize Visit
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground font-bold italic tracking-tighter">
                        * Submission locks location integrity and triggers follow-up notifications.
                    </p>
                </div>
            </div>
        </div>
    );
}
