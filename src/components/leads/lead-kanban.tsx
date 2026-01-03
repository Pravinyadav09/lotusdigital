"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";

const COLUMNS = [
    { id: "new", title: "New Discovery", color: "bg-blue-500" },
    { id: "qualified", title: "Qualified / Demo", color: "bg-indigo-500" },
    { id: "proposal", title: "Proposal Issued", color: "bg-violet-500" },
    { id: "negotiation", title: "Negotiation", color: "bg-orange-500" },
    { id: "closed", title: "Closed Won", color: "bg-emerald-500" },
];

const MOCK_LEADS = [
    { id: "L-101", name: "Pixel Printers", amount: "₹ 12.5L", temp: "hot", product: "Konica 512i", status: "new" },
    { id: "L-105", name: "Modern Flex", amount: "₹ 8.5L", temp: "warm", product: "Starfire 1024", status: "qualified" },
    { id: "L-108", name: "Gurgaon Prints", amount: "₹ 24.0L", temp: "hot", product: "Ricoh Gen5", status: "proposal" },
    { id: "L-110", name: "Rapid Graphics", amount: "₹ 6.2L", temp: "cold", product: "Laser Cutter", status: "negotiation" },
];

export function LeadKanban() {
    return (
        <div className="flex gap-2 sm:gap-4 overflow-x-auto lg:overflow-x-hidden pb-6 h-[calc(100vh-280px)] min-h-[500px]">
            {COLUMNS.map((col) => (
                <div key={col.id} className="flex-1 min-w-[200px] max-w-[450px] bg-slate-50/50 rounded-lg p-2 sm:p-3 border border-slate-100 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${col.color}`} />
                            <h3 className="text-sm font-bold text-slate-700">{col.title}</h3>
                        </div>
                        <Badge variant="secondary" className="text-[10px]">
                            {MOCK_LEADS.filter(l => l.status === col.id).length}
                        </Badge>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                        {MOCK_LEADS.filter(l => l.status === col.id).map((lead) => (
                            <Card key={lead.id} className="cursor-grab active:scale-95 transition-all hover:border-blue-200 hover:shadow-sm">
                                <CardContent className="p-3 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <p className="text-xs font-bold text-slate-800">{lead.name}</p>
                                        <Badge variant="outline" className={`text-[8px] px-1 h-3 font-bold uppercase ${lead.temp === 'hot' ? 'text-red-600 bg-red-50 border-red-100' :
                                            lead.temp === 'warm' ? 'text-orange-600 bg-orange-50 border-orange-100' :
                                                'text-blue-600 bg-blue-50 border-blue-100'
                                            }`}>
                                            {lead.temp}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-muted-foreground">{lead.product}</span>
                                        <span className="font-bold text-slate-700">{lead.amount}</span>
                                    </div>
                                    <div className="pt-2 border-t flex justify-between items-center text-[9px] text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Icons.users className="h-3 w-3" />
                                            <span>Rahul S.</span>
                                        </div>
                                        <span>2d ago</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
