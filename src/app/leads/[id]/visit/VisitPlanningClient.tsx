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
        completed: false
    });

    // Simulate GPS capture
    const handleCheckIn = () => {
        setIsCheckingIn(true);

        // Simulate GPS fetch (in real app, use navigator.geolocation)
        setTimeout(() => {
            if (typeof navigator !== 'undefined' && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setVisitData(prev => ({
                            ...prev,
                            gpsLat: latitude,
                            gpsLng: longitude,
                            checkedIn: true
                        }));
                        toast.success(`Checked in at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                        setIsCheckingIn(false);
                    },
                    (error) => {
                        // Fallback to mock GPS for testing
                        setVisitData(prev => ({
                            ...prev,
                            gpsLat: 28.5494,
                            gpsLng: 77.2501,
                            checkedIn: true
                        }));
                        toast.warning("GPS mock: Using sample coordinates");
                        setIsCheckingIn(false);
                    }
                );
            } else {
                // Mock GPS for testing
                setVisitData(prev => ({
                    ...prev,
                    gpsLat: 28.5494,
                    gpsLng: 77.2501,
                    checkedIn: true
                }));
                toast.warning("GPS not available. Using mock location.");
                setIsCheckingIn(false);
            }
        }, 1000);
    };

    const handleCompleteVisit = () => {
        if (!visitData.checkedIn) {
            toast.error("Please check-in first before completing visit");
            return;
        }

        if (!visitData.notes.trim()) {
            toast.error("Please add visit notes before completing");
            return;
        }

        toast.success("Visit completed successfully!");
        setTimeout(() => {
            router.push(`/leads/${id}`);
        }, 1000);
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Simulate photo upload
        toast.success("Photo uploaded (Mock)");
    };

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 h-full overflow-y-auto max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <Icons.arrowRight className="h-5 w-5 rotate-180" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Plan Visit</h2>
                    <p className="text-muted-foreground">Lead ID: {id}</p>
                </div>
            </div>

            {/* Visit Status */}
            {visitData.checkedIn && (
                <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                            <Icons.check className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-green-700">Checked In</span>
                            <Badge variant="outline" className="ml-auto">
                                <Icons.location className="mr-1 h-3 w-3" />
                                GPS: {visitData.gpsLat?.toFixed(4)}, {visitData.gpsLng?.toFixed(4)}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Schedule */}
            <Card>
                <CardHeader>
                    <CardTitle>Visit Schedule</CardTitle>
                    <CardDescription>Plan your customer visit date and time</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input
                                type="date"
                                value={visitData.scheduledDate}
                                onChange={(e) => setVisitData({ ...visitData, scheduledDate: e.target.value })}
                                disabled={visitData.checkedIn}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Time</Label>
                            <Input
                                type="time"
                                value={visitData.scheduledTime}
                                onChange={(e) => setVisitData({ ...visitData, scheduledTime: e.target.value })}
                                disabled={visitData.checkedIn}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* GPS Check-in */}
            <Card>
                <CardHeader>
                    <CardTitle>Location Check-In</CardTitle>
                    <CardDescription>Verify your presence at customer location</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!visitData.checkedIn ? (
                        <Button
                            onClick={handleCheckIn}
                            disabled={isCheckingIn}
                            className="w-full md:w-auto"
                        >
                            {isCheckingIn ? (
                                <>
                                    <Icons.location className="mr-2 h-4 w-4 animate-pulse" />
                                    Capturing GPS...
                                </>
                            ) : (
                                <>
                                    <Icons.location className="mr-2 h-4 w-4" />
                                    Check-In (Capture GPS)
                                </>
                            )}
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2 text-green-600">
                            <Icons.check className="h-5 w-5" />
                            <span>Checked in successfully</span>
                        </div>
                    )}

                    <div className="p-4 bg-muted rounded-md text-sm">
                        <div className="flex items-start gap-2">
                            <Icons.warning className="h-4 w-4 text-amber-500 mt-0.5" />
                            <div>
                                <p className="font-medium">Geo-Fencing Active</p>
                                <p className="text-muted-foreground text-xs mt-1">
                                    Your location must be within 500 meters of customer address for valid check-in.
                                </p>
                            </div>
                        </div>
                    </div>

                    {visitData.gpsLat && visitData.gpsLng && (
                        <div className="rounded-md border overflow-hidden">
                            {/* Placeholder for map - In real app, use Google Maps */}
                            <div className="h-[200px] bg-muted flex items-center justify-center">
                                <div className="text-center">
                                    <Icons.location className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">Map View</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Lat: {visitData.gpsLat.toFixed(6)}, Lng: {visitData.gpsLng.toFixed(6)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Visit Notes */}
            <Card>
                <CardHeader>
                    <CardTitle>Visit Notes & Photos</CardTitle>
                    <CardDescription>Document your customer meeting</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Meeting Summary</Label>
                        <Textarea
                            placeholder="Enter visit notes: discussion points, customer feedback, requirements..."
                            value={visitData.notes}
                            onChange={(e) => setVisitData({ ...visitData, notes: e.target.value })}
                            rows={5}
                            disabled={!visitData.checkedIn}
                        />
                        {!visitData.checkedIn && (
                            <p className="text-xs text-muted-foreground">Check-in first to add notes</p>
                        )}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <Label>Upload Photos</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            multiple
                            disabled={!visitData.checkedIn}
                            onChange={handlePhotoUpload}
                        />
                        <p className="text-xs text-muted-foreground">
                            Optional: Machine location, samples, site photos
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4 sticky bottom-0 bg-background pt-4 pb-2 border-t">
                <Button variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button
                    onClick={handleCompleteVisit}
                    disabled={!visitData.checkedIn}
                    className="bg-green-600 hover:bg-green-700"
                >
                    <Icons.check className="mr-2 h-4 w-4" />
                    Complete Visit
                </Button>
            </div>
        </div>
    );
}
