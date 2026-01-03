"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export interface Geofence {
    id: string;
    name: string;
    description: string;
    lat: number;
    lng: number;
    radius: number; // in meters
    isActive: boolean;
    type: "Customer" | "Office" | "Service Center";
}

export interface VisitLog {
    id: string;
    visitId: string;
    geofenceId: string;
    timestamp: string;
    status: "verified" | "failed";
    distance: number;
    coordinates: { lat: number; lng: number };
}

interface GeofenceContextType {
    geofences: Geofence[];
    visitLogs: VisitLog[];
    addGeofence: (geofence: Omit<Geofence, "id">) => void;
    updateGeofence: (id: string, updates: Partial<Geofence>) => void;
    deleteGeofence: (id: string) => void;
    logVisit: (log: Omit<VisitLog, "id">) => void;
    getGeofenceById: (id: string) => Geofence | undefined;
    verifyLocation: (targetLat: number, targetLng: number, radius: number) => Promise<{ success: boolean; distance: number }>;
}

const GeofenceContext = createContext<GeofenceContextType | undefined>(undefined);

const DEFAULT_GEOFENCES: Geofence[] = [
    { id: "GF-001", name: "Pixel Printers HQ", description: "Okhla Industrial Area", lat: 28.5355, lng: 77.2732, radius: 500, isActive: true, type: "Customer" },
    { id: "GF-002", name: "Sharma Graphics", description: "Naraina Industrial Area", lat: 28.6276, lng: 77.1354, radius: 500, isActive: true, type: "Customer" },
    { id: "GF-003", name: "Lotus Digital Head Office", description: "Corporate Center, Delhi", lat: 28.6139, lng: 77.2090, radius: 200, isActive: true, type: "Office" },
];

export function GeofenceProvider({ children }: { children: React.ReactNode }) {
    const [geofences, setGeofences] = useState<Geofence[]>(DEFAULT_GEOFENCES);
    const [visitLogs, setVisitLogs] = useState<VisitLog[]>([]);

    // Persistence logic (localStorage for demo stability)
    useEffect(() => {
        const savedGeofences = localStorage.getItem("lotus_geofences");
        const savedLogs = localStorage.getItem("lotus_visit_logs");
        if (savedGeofences) setGeofences(JSON.parse(savedGeofences));
        if (savedLogs) setVisitLogs(JSON.parse(savedLogs));
    }, []);

    useEffect(() => {
        localStorage.setItem("lotus_geofences", JSON.stringify(geofences));
        localStorage.setItem("lotus_visit_logs", JSON.stringify(visitLogs));
    }, [geofences, visitLogs]);

    const addGeofence = (gf: Omit<Geofence, "id">) => {
        const newGf = { ...gf, id: `GF-${Date.now()}` };
        setGeofences(prev => [...prev, newGf]);
        toast.success(`Geofence '${gf.name}' created successfully.`);
    };

    const updateGeofence = (id: string, updates: Partial<Geofence>) => {
        setGeofences(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
        toast.info("Geofence configuration updated.");
    };

    const deleteGeofence = (id: string) => {
        setGeofences(prev => prev.filter(g => g.id !== id));
        toast.error("Geofence removed from system.");
    };

    const logVisit = (log: Omit<VisitLog, "id">) => {
        const newLog = { ...log, id: `LOG-${Date.now()}` };
        setVisitLogs(prev => [newLog, ...prev]);
    };

    const getGeofenceById = (id: string) => geofences.find(g => g.id === id);

    const verifyLocation = async (targetLat: number, targetLng: number, radius: number): Promise<{ success: boolean; distance: number }> => {
        // Simulate a delay for GPS acquisition
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Haversine formula for distance calculation
        const R = 6371e3; // Earth radius in meters
        const φ1 = (targetLat * Math.PI) / 180;
        // Mock current location slightly offset from target for demo
        const currentLat = targetLat + (Math.random() - 0.5) * 0.005;
        const currentLng = targetLng + (Math.random() - 0.5) * 0.005;
        const φ2 = (currentLat * Math.PI) / 180;
        const Δφ = ((currentLat - targetLat) * Math.PI) / 180;
        const Δλ = ((currentLng - targetLng) * Math.PI) / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // Distance in meters
        return {
            success: distance <= radius,
            distance: Math.round(distance)
        };
    };

    return (
        <GeofenceContext.Provider value={{
            geofences,
            visitLogs,
            addGeofence,
            updateGeofence,
            deleteGeofence,
            logVisit,
            getGeofenceById,
            verifyLocation
        }}>
            {children}
        </GeofenceContext.Provider>
    );
}

export const useGeofence = () => {
    const context = useContext(GeofenceContext);
    if (context === undefined) {
        throw new Error("useGeofence must be used within a GeofenceProvider");
    }
    return context;
};
