"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function SyncQueue() {
    const [isSyncing, setIsSyncing] = useState(false);
    const [queue, setQueue] = useState([
        { id: 1, type: "Lead", name: "Modern Prints", detail: "Initial Discovery", time: "10 mins ago", status: "pending" },
        { id: 2, type: "Visit", name: "Pixel Printers", detail: "Service Check-in (GPS Verified)", time: "25 mins ago", status: "pending" },
    ]);

    const handleSync = () => {
        setIsSyncing(true);
        toast.promise(new Promise(r => setTimeout(r, 3000)), {
            loading: 'Establishing secure link to Lotus Cloud...',
            success: () => {
                setIsSyncing(false);
                setQueue([]);
                return 'Sync Complete: 2 items pushed to central DB.';
            },
            error: 'Link timeout. Retrying in background.'
        });
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className="w-full p-2 bg-blue-50 border border-blue-100 rounded-md flex flex-col cursor-pointer hover:bg-blue-100 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${queue.length > 0 ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`} />
                            <span className="text-[10px] font-bold text-blue-700 uppercase">
                                {queue.length > 0 ? `${queue.length} Pending Sync` : 'System Sycned'}
                            </span>
                        </div>
                        <Icons.logo className="h-3 w-3 text-blue-500" />
                    </div>
                    <div className="mt-1 flex justify-between items-center text-[8px] text-muted-foreground">
                        <span>Last Sync: 10:05 AM</span>
                        <span>Ver: 2.0.4</span>
                    </div>
                </div>
            </SheetTrigger>
            <SheetContent side="right" className="w-[350px]">
                <SheetHeader>
                    <SheetTitle>Offline Sync Manager</SheetTitle>
                    <SheetDescription>
                        Data captured in rural/low-connectivity areas is stored locally.
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                    {queue.length === 0 ? (
                        <div className="text-center py-10">
                            <Icons.check className="h-12 w-12 text-green-500 mx-auto mb-2" />
                            <p className="text-sm font-medium">All clear! No pending tasks.</p>
                        </div>
                    ) : (
                        queue.map((item) => (
                            <div key={item.id} className="p-3 border rounded-lg bg-orange-50/30 border-orange-100">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className="text-[9px] uppercase">{item.type}</Badge>
                                    <span className="text-[10px] text-muted-foreground">{item.time}</span>
                                </div>
                                <p className="text-sm font-bold">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.detail}</p>
                            </div>
                        ))
                    )}
                </div>
                {queue.length > 0 && (
                    <div className="absolute bottom-6 left-6 right-6">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSync} disabled={isSyncing}>
                            <Icons.logo className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                            {isSyncing ? 'Syncing...' : 'Push to Cloud Now'}
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
