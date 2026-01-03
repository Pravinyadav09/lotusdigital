"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Next.js
const fixLeafletIcon = () => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
};

interface OSMMapProps {
    center: [number, number];
    zoom?: number;
    geofences?: {
        id: string;
        name: string;
        lat: number;
        lng: number;
        radius: number;
        isActive: boolean;
    }[];
    onMarkerClick?: (id: string) => void;
    onMapClick?: (lat: number, lng: number) => void;
    height?: string;
}

// Component to handle map clicks
function MapEvents({ onClick }: { onClick?: (lat: number, lng: number) => void }) {
    useMapEvents({
        click: (e) => {
            onClick?.(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

// Component to handle map centering when geofences change or center changes
function MapResizer({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
}

export default function OSMMap({ center, zoom = 13, geofences = [], onMarkerClick, onMapClick, height = "400px" }: OSMMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        fixLeafletIcon();
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div style={{ height, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading Map...</div>;

    return (
        <div className="relative z-0 rounded-lg overflow-hidden shadow-inner border border-muted" style={{ height, width: "100%" }}>
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapEvents onClick={onMapClick} />
                <MapResizer center={center} />

                {geofences.map((gf) => (
                    <div key={gf.id}>
                        <Marker
                            position={[gf.lat, gf.lng]}
                            eventHandlers={{
                                click: () => onMarkerClick?.(gf.id),
                            }}
                        >
                            <Popup>
                                <div className="p-1">
                                    <h4 className="font-bold text-sm">{gf.name}</h4>
                                    <p className="text-[10px] text-muted-foreground">Radius: {gf.radius}m</p>
                                    <p className="text-[10px] text-muted-foreground">Status: {gf.isActive ? "Active" : "Inactive"}</p>
                                </div>
                            </Popup>
                        </Marker>
                        <Circle
                            center={[gf.lat, gf.lng]}
                            radius={gf.radius}
                            pathOptions={{
                                color: gf.isActive ? "#3b82f6" : "#94a3b8",
                                fillColor: gf.isActive ? "#3b82f6" : "#94a3b8",
                                fillOpacity: 0.2,
                            }}
                        />
                    </div>
                ))}
            </MapContainer>
        </div>
    );
}
