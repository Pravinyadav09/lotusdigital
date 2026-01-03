"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface CatalogItem {
    id: string;
    name: string;
    status: string;
}

export interface Machine extends CatalogItem {
    type: string;
    basePrice: number;
    hsn: string;
}

export interface Head extends CatalogItem {
    resolution: string;
    price: number;
}

export interface Accessory extends CatalogItem {
    price: number;
    category: string;
}

interface CatalogContextType {
    machines: Machine[];
    heads: Head[];
    accessories: Accessory[];
    addMachine: (item: Machine) => void;
    addHead: (item: Head) => void;
    addAccessory: (item: Accessory) => void;
}

const INITIAL_DATA = {
    machines: [
        { id: "M1", name: "Lotus Max 5000", type: "Inkjet", basePrice: 1200000, hsn: "8443", status: "Active" },
        { id: "M2", name: "Lotus Pro 2000", type: "Laser", basePrice: 850000, hsn: "8456", status: "Active" },
        { id: "M3", name: "Lotus Hybrid X1", type: "Hybrid", basePrice: 1550000, hsn: "8443", status: "Review" },
    ],
    heads: [
        { id: "H1", name: "Konica 512i", resolution: "30pl", price: 45000, status: "In-Stock" },
        { id: "H2", name: "Konica 1024i", resolution: "13pl", price: 85000, status: "Low-Stock" },
        { id: "H3", name: "Ricoh Gen5", resolution: "7pl", price: 110000, status: "Special Order" },
    ],
    accessories: [
        { id: "A1", name: "Extra Take-up Roller", price: 25000, category: "Hardware", status: "Active" },
        { id: "A2", name: "UV Curing Lamp Kit", price: 95000, category: "Add-on", status: "Active" },
        { id: "A3", name: "External Dryer Fan", price: 15000, category: "Hardware", status: "Active" },
        { id: "A4", name: "PC Station with RIP Software", price: 45000, category: "Hardware", status: "Active" },
    ]
};

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export function CatalogProvider({ children }: { children: ReactNode }) {
    const [machines, setMachines] = useState<Machine[]>(INITIAL_DATA.machines);
    const [heads, setHeads] = useState<Head[]>(INITIAL_DATA.heads);
    const [accessories, setAccessories] = useState<Accessory[]>(INITIAL_DATA.accessories);

    const addMachine = (item: Machine) => setMachines(prev => [...prev, item]);
    const addHead = (item: Head) => setHeads(prev => [...prev, item]);
    const addAccessory = (item: Accessory) => setAccessories(prev => [...prev, item]);

    return (
        <CatalogContext.Provider value={{ machines, heads, accessories, addMachine, addHead, addAccessory }}>
            {children}
        </CatalogContext.Provider>
    );
}

export function useCatalog() {
    const context = useContext(CatalogContext);
    if (!context) {
        throw new Error("useCatalog must be used within a CatalogProvider");
    }
    return context;
}
