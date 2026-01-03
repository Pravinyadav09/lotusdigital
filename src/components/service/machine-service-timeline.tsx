"use client";

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";

export function MachineServiceTimeline({ machineId }: { machineId: string }) {
    const history = [
        { date: "2024-05-01", type: "Repair", desc: "Magenta Printhead Cleansing & Alignment", engineer: "Rahul Service", part: "None", cost: "₹ 2,500 (Labor)" },
        { date: "2024-03-10", type: "Preventive", desc: "Quarterly AMC Maintenance - Filter Cleaning", engineer: "Amit Service", part: "Air Filter (LX-901)", cost: "₹ 0 (AMC Covered)" },
        { date: "2023-12-15", type: "Breakdown", desc: "Mainboard Error - Power Surge Protection", engineer: "Rajesh Service", part: "Fuse Kit", cost: "₹ 8,400" },
        { date: "2023-10-05", type: "Installation", desc: "Initial Setup & Customer Training", engineer: "Amit Service", part: "Machine Core", cost: "Included" },
    ];

    return (
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {history.map((item, i) => (
                <div key={i} className="relative flex items-start gap-6 pl-8">
                    <div className={`absolute left-0 h-8 w-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${item.type === 'Repair' ? 'bg-orange-500' :
                            item.type === 'Preventive' ? 'bg-blue-500' :
                                item.type === 'Breakdown' ? 'bg-red-500' : 'bg-green-500'
                        }`}>
                        {item.type === 'Repair' && <Icons.settings className="h-3 w-3 text-white" />}
                        {item.type === 'Preventive' && <Icons.check className="h-3 w-3 text-white" />}
                        {item.type === 'Breakdown' && <Icons.warning className="h-3 w-3 text-white" />}
                        {item.type === 'Installation' && <Icons.add className="h-3 w-3 text-white" />}
                    </div>
                    <div className="flex-1 pb-4 border-b border-slate-100 last:border-0">
                        <div className="flex justify-between items-start mb-1">
                            <div>
                                <p className="text-sm font-bold text-slate-800">{item.desc}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-semibold">{item.type} • {item.date}</p>
                            </div>
                            <Badge variant="outline" className="text-[9px] h-5">{item.cost}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                                <Icons.users className="h-3 w-3 text-muted-foreground" />
                                <span className="text-[10px] font-medium text-slate-600">{item.engineer}</span>
                            </div>
                            {item.part !== 'None' && (
                                <div className="flex items-center gap-1">
                                    <Icons.menu className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-[10px] font-medium text-slate-600">Part: {item.part}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
