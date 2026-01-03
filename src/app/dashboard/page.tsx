"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [isMapOpen, setIsMapOpen] = useState(false);

    // Role-specific stats
    const getStatsForRole = () => {
        switch (user?.role) {
            case "super_admin":
            case "sales_manager":
                return [
                    { title: "Active Leads", value: "24", icon: Icons.leads, description: "+4 from last week", color: "text-blue-500" },
                    { title: "Pending Quotes", value: "12", icon: Icons.quotes, description: "3 waiting approval", color: "text-amber-500" },
                    { title: "Monthly Revenue", value: "₹45.2L", icon: Icons.accounting, description: "+12% vs last month", color: "text-green-500" },
                    { title: "Open Tickets", value: "8", icon: Icons.service, description: "2 high priority", color: "text-rose-500" },
                ];
            case "senior_sales_rep":
                return [
                    { title: "My Leads", value: "8", icon: Icons.leads, description: "3 new this week", color: "text-blue-500" },
                    { title: "My Quotes", value: "5", icon: Icons.quotes, description: "2 pending approval", color: "text-amber-500" },
                    { title: "Conversions", value: "3", icon: Icons.check, description: "This month", color: "text-green-500" },
                    { title: "Visits Pending", value: "4", icon: Icons.location, description: "Scheduled", color: "text-orange-500" },
                ];
            case "finance_user":
                return [
                    { title: "Outstanding", value: "₹24.5L", icon: Icons.warning, description: "8 invoices", color: "text-red-500" },
                    { title: "Collected", value: "₹12.8L", icon: Icons.check, description: "This month", color: "text-green-500" },
                    { title: "GST Payable", value: "₹4.3L", icon: Icons.accounting, description: "Due by 20th", color: "text-amber-500" },
                    { title: "Payments Due", value: "15", icon: Icons.bell, description: "Next 7 days", color: "text-blue-500" },
                ];
            case "service_engineer":
                return [
                    { title: "Assigned Tickets", value: "6", icon: Icons.service, description: "2 urgent", color: "text-red-500" },
                    { title: "Completed Today", value: "3", icon: Icons.check, description: "On schedule", color: "text-green-500" },
                    { title: "Parts Pending", value: "2", icon: Icons.warning, description: "Awaiting stock", color: "text-amber-500" },
                    { title: "Installations", value: "1", icon: Icons.location, description: "Scheduled", color: "text-blue-500" },
                ];
            case "customer":
                return [
                    { title: "My Machines", value: "2", icon: Icons.logo, description: "Active", color: "text-blue-500" },
                    { title: "Open Tickets", value: "1", icon: Icons.service, description: "In progress", color: "text-amber-500" },
                    { title: "Pending Payment", value: "₹0", icon: Icons.check, description: "All clear", color: "text-green-500" },
                    { title: "AMC Status", value: "Active", icon: Icons.check, description: "Valid till Dec 2024", color: "text-green-500" },
                ];
            default:
                return [];
        }
    };

    const stats = getStatsForRole();

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}!</h2>
                    <p className="text-muted-foreground">
                        <Badge variant="outline" className="mt-1">
                            {user?.role?.replace(/_/g, " ").toUpperCase()}
                        </Badge>
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    {/* Date Range Filter Mock */}
                    {(user?.role === "super_admin" || user?.role === "sales_manager") && (
                        <div className="hidden md:flex items-center space-x-2 mr-2">
                            <Button variant="outline" size="sm" className="h-8">
                                <Icons.calendar className="mr-2 h-3 w-3" />
                                This Month
                            </Button>
                            <Button variant="outline" size="sm" className="h-8">
                                <Icons.filter className="mr-2 h-3 w-3" />
                                All Regions
                            </Button>
                        </div>
                    )}

                    <Button variant="outline" size="icon" className="relative" onClick={() => toast.info("No new notifications")}>
                        <Icons.bell className="h-4 w-4" />
                        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-600 border-2 border-background" />
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/reports")}>
                        <Icons.reports className="mr-2 h-4 w-4" />
                        Reports
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-full md:col-span-4">
                    <CardHeader>
                        <CardTitle>
                            {user?.role === "customer" ? "My Quotations" :
                                user?.role === "senior_sales_rep" ? "Today's Visit Schedule" :
                                    "Sales Pipeline"}
                        </CardTitle>
                        <CardDescription>
                            {user?.role === "customer"
                                ? "View your quotation history"
                                : user?.role === "senior_sales_rep"
                                    ? "Your assigned customer visits for today"
                                    : "Overview of team performance and deals"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {user?.role === "sales_manager" || user?.role === "super_admin" ? (
                            // ... Manager View (Keep existing) ...
                            <div className="space-y-6">
                                {/* Pipeline Funnel Mock */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>Leads (45)</span>
                                        <span className="font-bold">₹ 2.4 Cr</span>
                                    </div>
                                    <div className="h-4 w-full bg-blue-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[100%]" />
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span>Quotes (12)</span>
                                        <span className="font-bold">₹ 85 L</span>
                                    </div>
                                    <div className="h-4 w-full bg-amber-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500 w-[40%]" />
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span>Deals Won (5)</span>
                                        <span className="font-bold">₹ 32 L</span>
                                    </div>
                                    <div className="h-4 w-full bg-green-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-[15%]" />
                                    </div>
                                </div>

                                {/* Team Performance Table */}
                                <div className="pt-4 border-t">
                                    <h4 className="font-semibold mb-3">Team Performance</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs">RS</div>
                                                <div>
                                                    <p className="font-medium">Rahul Sales</p>
                                                    <p className="text-xs text-muted-foreground">8 Leads • 3 Quotes</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-green-600 bg-green-50">Top Performer</Badge>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs">AJ</div>
                                                <div>
                                                    <p className="font-medium">Amit Jain</p>
                                                    <p className="text-xs text-muted-foreground">5 Leads • 1 Quote</p>
                                                </div>
                                            </div>
                                            <span className="text-muted-foreground text-xs">Target: 60%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : user?.role === "senior_sales_rep" ? (
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-3 border rounded-lg bg-muted/50">
                                    <div className="flex flex-col items-center justify-center h-12 w-12 rounded bg-blue-100 text-blue-700 font-bold shrink-0">
                                        <span>10</span>
                                        <span className="text-[10px] uppercase">AM</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">Pixel Printers - Demo</p>
                                        <p className="text-sm text-muted-foreground">Okhla Phase III • New Lead</p>
                                    </div>
                                    <Button size="sm" variant="outline" className="h-8 shadow-sm hover:bg-slate-100 transition-all active:scale-95" onClick={() => {
                                        toast.info("Opening GPS Navigation...");
                                        router.push("/visits");
                                    }}>
                                        <Icons.location className="mr-2 h-3 w-3 text-blue-600" />
                                        Start Visit
                                    </Button>
                                </div>

                                <div className="flex items-start gap-4 p-3 border rounded-lg bg-muted/50">
                                    <div className="flex flex-col items-center justify-center h-12 w-12 rounded bg-orange-100 text-orange-700 font-bold shrink-0">
                                        <span>02</span>
                                        <span className="text-[10px] uppercase">PM</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">Sharma Graphics - Closing</p>
                                        <p className="text-sm text-muted-foreground">Naraina Ind. Area • Follow-up</p>
                                    </div>
                                    <Button size="sm" variant="outline" className="h-8 shadow-sm hover:bg-slate-100 transition-all active:scale-95" onClick={() => {
                                        toast.info("Opening GPS Navigation...");
                                        router.push("/visits");
                                    }}>
                                        <Icons.location className="mr-2 h-3 w-3 text-blue-600" />
                                        Start Visit
                                    </Button>
                                </div>

                                <div className="p-3 text-center">
                                    <Button variant="link" className="text-muted-foreground" onClick={() => router.push("/visits")}>
                                        View Full Calendar
                                    </Button>
                                </div>
                            </div>
                        ) : user?.role === "service_engineer" ? (
                            <div className="space-y-4">
                                {[
                                    { id: "SR-101", customer: "Singh Graphics", machine: "LP-5000 (S/N: 2024-X1)", issue: "Drum Error", priority: "High", time: "10:30 AM" },
                                    { id: "SR-105", customer: "Super Flex", machine: "LP-2000 (S/N: 2023-B5)", issue: "Calibration", priority: "Medium", time: "02:00 PM" },
                                ].map((call) => (
                                    <div key={call.id} className="flex items-start gap-4 p-3 border rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                        <div className={`flex flex-col items-center justify-center h-12 w-12 rounded font-bold shrink-0 ${call.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                            <span className="text-xs uppercase">{call.priority}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium truncate">{call.customer}</p>
                                                <Badge variant="outline" className="text-[10px] h-4">{call.id}</Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate">{call.machine} • {call.issue}</p>
                                            <p className="text-xs font-semibold mt-1 flex items-center gap-1">
                                                <Icons.calendar className="h-3 w-3" /> Scheduled: {call.time}
                                            </p>
                                        </div>
                                        <Button size="sm" variant="outline" className="h-8 shadow-sm hover:bg-slate-100 transition-all active:scale-95" onClick={() => toast.info(`Opening Navigation to ${call.customer}...`)}>
                                            <Icons.location className="mr-2 h-3 w-3 text-red-600" />
                                            Navigate
                                        </Button>
                                    </div>
                                ))}
                                <Button variant="link" className="w-full text-muted-foreground text-xs" onClick={() => router.push("/service")}>View All Assigned Calls</Button>
                            </div>
                        ) : user?.role === "customer" ? (
                            <div className="space-y-4">
                                {[
                                    { model: "LP-5000 Max", sn: "2024-X1", status: "Running", health: "98%", nextService: "15 Mar 2024" },
                                    { model: "LP-2000 Mini", sn: "2023-B5", status: "Locked", health: "N/A", reason: "Payment Overdue" },
                                ].map((machine) => (
                                    <div key={machine.sn} className="p-3 border rounded-lg space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold">{machine.model}</p>
                                                <p className="text-xs text-muted-foreground">Serial: {machine.sn}</p>
                                            </div>
                                            <Badge variant={machine.status === 'Running' ? 'default' : 'destructive'} className={machine.status === 'Running' ? 'bg-green-600' : ''}>
                                                {machine.status}
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t">
                                            <div>
                                                <p className="text-muted-foreground">Machine Health</p>
                                                <p className="font-semibold text-blue-600">{machine.health}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Next Maintenance</p>
                                                <p className="font-semibold">{machine.nextService || machine.reason}</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" className="w-full text-xs h-7 shadow-sm hover:bg-blue-50 transition-all" onClick={() => router.push("/service")}>Raise Service Request</Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                                No active data to display.
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="col-span-full md:col-span-3">
                    <CardHeader>
                        <CardTitle>
                            {user?.role === "finance_user" ? "Recent Collections" :
                                user?.role === "service_engineer" ? "Critical Machine Alerts" :
                                    user?.role === "customer" ? "Payment & EMI Alerts" :
                                        "Recent Activity"}
                        </CardTitle>
                        <CardDescription>
                            {user?.role === "finance_user" ? "Latest payments received" :
                                user?.role === "service_engineer" ? "Machines requiring immediate attention" :
                                    user?.role === "customer" ? "Upcoming dues and pending service calls" :
                                        "Latest updates in your workspace"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Live Map Placeholder - Hide for Finance/Customer */}
                            {user?.role !== "finance_user" && user?.role !== "customer" && (
                                <div
                                    className="h-[150px] w-full bg-slate-100 rounded-md border flex items-center justify-center relative overflow-hidden group cursor-pointer"
                                    onClick={() => setIsMapOpen(true)}
                                >
                                    <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=28.6139,77.2090&zoom=11&size=400x200')] bg-cover opacity-20" />
                                    <div className="z-10 text-center">
                                        <Icons.location className="h-8 w-8 mx-auto text-blue-500 mb-1 animate-bounce" />
                                        <p className="text-xs font-semibold text-slate-700">{user?.role === 'service_engineer' ? 'Assigned Sites' : 'Live Field View'}</p>
                                        <p className="text-[10px] text-muted-foreground">{user?.role === 'service_engineer' ? '2 Visits Today' : '4 Reps Active'}</p>
                                    </div>
                                    <div className="absolute top-1/4 left-1/4 h-2 w-2 bg-red-500 rounded-full animate-ping" />
                                    <div className="absolute top-1/2 right-1/3 h-2 w-2 bg-green-500 rounded-full" />
                                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors flex items-center justify-center">
                                        <span className="bg-white/90 px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                            <Icons.view className="h-3 w-3" /> Expand Map
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Role Specific Right Card Content */}
                            <div className="space-y-4">
                                {user?.role === "customer" ? (
                                    <div className="space-y-4">
                                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Icons.warning className="h-4 w-4 text-red-600" />
                                                <span className="text-xs font-bold text-red-700">EMI OVERDUE</span>
                                            </div>
                                            <p className="text-[10px] text-red-600">Your EMI for LP-2000 is 5 days overdue. Machine is currently locked.</p>
                                            <Button variant="link" className="h-auto p-0 text-[10px] text-red-700 underline mt-1 font-bold italic" onClick={() => {
                                                toast.info("Opening Secure Payment Gateway...");
                                                setTimeout(() => toast.success("Payment successful! Machine Unlocked."), 2000);
                                            }}>Pay ₹ 50,000 Now</Button>
                                        </div>
                                        <div className="flex items-center gap-3 p-2 border rounded-lg bg-blue-50/50">
                                            <Icons.service className="h-4 w-4 text-blue-500" />
                                            <div>
                                                <p className="text-xs font-medium">SR-501: Drum Error</p>
                                                <p className="text-[10px] text-muted-foreground">Engineer Assigned: Rajesh</p>
                                            </div>
                                            <Badge className="ml-auto text-[8px] h-4">IN PROGRESS</Badge>
                                        </div>
                                    </div>
                                ) : (user?.role === "finance_user" ? [1, 2, 3, 4] :
                                    user?.role === "service_engineer" ? [1, 2] : [1, 2, 3]).map((_, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <div className={`h-2 w-2 rounded-full ${user?.role === "finance_user" ? "bg-green-500" :
                                                user?.role === "service_engineer" ? "bg-red-500" : "bg-blue-500"
                                                }`} />
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {user?.role === "finance_user"
                                                        ? `Payment Received - ₹${[50000, 12000, 75000, 25000][i]}`
                                                        : user?.role === "service_engineer"
                                                            ? `Machine Locked: Super Flex (${['Overdue EMI', 'Contract Expired'][i]})`
                                                            : user?.role === "customer"
                                                                ? "Service Request Updated"
                                                                : "New Quote Generated"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {user?.role === "finance_user"
                                                        ? "Via NEFT • Ref #IBKL..."
                                                        : user?.role === "service_engineer"
                                                            ? "Payment Pending since 5 days"
                                                            : user?.role === "customer"
                                                                ? "Ticket #SR-501 - Assigned to engineer"
                                                                : "For Lotus Printing Press - ₹12.5L"}
                                                </p>
                                            </div>
                                            <div className="ml-auto text-xs text-muted-foreground">{1 + i}h ago</div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Admin Deep Dive: Sales & Field Operations */}
            {user?.role === "super_admin" && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Visual Sales Funnel */}
                    <Card className="col-span-full md:col-span-4">
                        <CardHeader>
                            <CardTitle>Enterprise Sales Funnel (Deep Dive)</CardTitle>
                            <CardDescription>Real-time conversion metrics across India regions.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-4">
                                {[
                                    { stage: "Total Leads Discovered", count: 452, value: "₹ 8.4 Cr", width: "100%", color: "bg-blue-500", icon: Icons.leads },
                                    { stage: "Qualified & Demo Done", count: 120, value: "₹ 4.2 Cr", width: "70%", color: "bg-indigo-500", icon: Icons.view },
                                    { stage: "Quotations Issued", count: 85, value: "₹ 3.1 Cr", width: "50%", color: "bg-violet-500", icon: Icons.quotes },
                                    { stage: "PI Generated & Advanced", count: 42, value: "₹ 1.8 Cr", width: "35%", color: "bg-purple-500", icon: Icons.accounting },
                                    { stage: "Final Deal Closed", count: 28, value: "₹ 1.2 Cr", width: "20%", color: "bg-emerald-500", icon: Icons.check },
                                ].map((step) => (
                                    <div key={step.stage} className="space-y-1">
                                        <div className="flex justify-between items-center text-xs">
                                            <div className="flex items-center gap-2 font-medium">
                                                <step.icon className="h-3 w-3" />
                                                <span>{step.stage} ({step.count})</span>
                                            </div>
                                            <span className="font-bold">{step.value}</span>
                                        </div>
                                        <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${step.color} transition-all duration-1000 ease-in-out`}
                                                style={{ width: step.width }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-3 gap-4 border-t pt-4 text-center">
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Conv. Rate</p>
                                    <p className="text-lg font-bold">6.2%</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Avg Deal Size</p>
                                    <p className="text-lg font-bold">₹ 14.2L</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Sales Cycle</p>
                                    <p className="text-lg font-bold">24 Days</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Field Activity Dashboard (Geo-Verified) */}
                    <Card className="col-span-full md:col-span-3">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                Field Rep Activity
                                <Badge variant="outline" className="text-green-600 bg-green-50 animate-pulse">Live</Badge>
                            </CardTitle>
                            <CardDescription>GPS Verified Sites & Check-ins (500m radius)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { name: "Rahul Singh", loc: "Okhla Ph-III", task: "Demo", status: "Verified", time: "10:15 AM", dist: "12m" },
                                { name: "Amit Kumar", loc: "Naraina Ind.", task: "Closing", status: "Verified", time: "11:30 AM", dist: "45m" },
                                { name: "Neha Sharma", loc: "Sector 62, Noida", task: "Payment", status: "Warning", time: "12:10 PM", dist: "850m" },
                                { name: "Vikram Ad.", loc: "Manesar", task: "Installation", status: "Verified", time: "12:45 PM", dist: "5m" },
                            ].map((rep, i) => (
                                <div key={i} className="flex items-center gap-3 p-2 border rounded hover:bg-muted transition-colors">
                                    <div className={`h-2 w-2 rounded-full ${rep.status === 'Verified' ? 'bg-green-500' : 'bg-red-500 animate-ping'}`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-medium truncate">{rep.name}</p>
                                            <span className="text-[10px] text-muted-foreground">{rep.time}</span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground truncate">{rep.loc} • {rep.task}</p>
                                    </div>
                                    <Badge className={`text-[8px] h-4 ${rep.status === 'Verified' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-red-100 text-red-700 hover:bg-red-100'}`}>
                                        {rep.dist}
                                    </Badge>
                                </div>
                            ))}
                            <Button
                                variant="ghost"
                                className="w-full text-xs text-blue-600 h-8 hover:bg-blue-50"
                                onClick={() => setIsMapOpen(true)}
                            >
                                View Master Field Map
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Master Map Dialog */}
            <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
                <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="p-6 bg-slate-900 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <DialogTitle className="text-xl">Master Field Operations Map</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                    Live tracking of {user?.role === 'service_engineer' ? 'Assigned Tickets' : 'Sales Reps'} across India Cluster.
                                </DialogDescription>
                            </div>
                            <Badge variant="outline" className="border-green-500 text-green-500 bg-green-500/10 animate-pulse">
                                <Icons.location className="mr-1 h-3 w-3" /> Live Sync Active
                            </Badge>
                        </div>
                    </DialogHeader>
                    <div className="flex-1 bg-slate-200 relative overflow-hidden">
                        {/* Mock Map Image */}
                        <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=28.6,77.2&zoom=11&size=1200x800&scale=2')] bg-cover">
                            {/* Animated Markers */}
                            <div className="absolute top-[40%] left-[30%] group">
                                <div className="h-4 w-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-bounce" />
                                <div className="absolute -top-10 -left-10 bg-white p-2 rounded shadow text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="font-bold">Rahul Singh (Okhla)</p>
                                    <p>Status: Verified Demo</p>
                                </div>
                            </div>
                            <div className="absolute top-[60%] left-[50%] group">
                                <div className="h-4 w-4 bg-emerald-600 rounded-full border-2 border-white shadow-lg animate-pulse" />
                            </div>
                            <div className="absolute top-[20%] left-[70%] group">
                                <div className="h-4 w-4 bg-orange-600 rounded-full border-2 border-white shadow-lg" />
                            </div>
                        </div>

                        {/* Map Overlay Stats */}
                        <div className="absolute bottom-6 left-6 grid grid-cols-3 gap-4 bg-white/90 backdrop-blur rounded-lg p-4 shadow-xl border">
                            <div className="text-center">
                                <p className="text-[10px] text-muted-foreground font-bold">ACTIVE REPS</p>
                                <p className="text-lg font-black">12</p>
                            </div>
                            <div className="text-center border-x px-4">
                                <p className="text-[10px] text-muted-foreground font-bold">AVG RADIUS</p>
                                <p className="text-lg font-black text-green-600">32m</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] text-muted-foreground font-bold">ALERTS</p>
                                <p className="text-lg font-black text-rose-600">1</p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Admin Financial Deep Dive */}
            {user?.role === "super_admin" && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Revenue Mix Chart */}
                    <Card className="col-span-full md:col-span-3">
                        <CardHeader>
                            <CardTitle>Revenue Mix (3-Section Analysis)</CardTitle>
                            <CardDescription>Body vs Service vs Accessories contribution.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 h-[250px] relative">
                            {/* Mock Multi-Series Chart */}
                            <div className="flex items-end justify-between h-40 gap-4 mt-4">
                                {[
                                    { label: "Body", val: "75%", color: "bg-blue-600", amount: "₹3.2Cr" },
                                    { label: "Service", val: "15%", color: "bg-emerald-600", amount: "₹65L" },
                                    { label: "Acc.", val: "10%", color: "bg-amber-600", amount: "₹42L" },
                                ].map((bar) => (
                                    <div key={bar.label} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                        <div className="w-full bg-slate-100 rounded-lg relative h-40 flex items-end overflow-hidden">
                                            <div
                                                className={`w-full ${bar.color} rounded-lg transition-all group-hover:opacity-80`}
                                                style={{ height: bar.val }}
                                            />
                                            <div className="absolute top-2 w-full text-center text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                                {bar.amount}
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium">{bar.label}</span>
                                        <span className="text-[10px] text-muted-foreground">{bar.val}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 p-3 bg-blue-50/50 border border-blue-100 rounded text-[10px] text-blue-700">
                                <Icons.warning className="h-3 w-3 inline mr-2" />
                                Service revenue increased by 12% following new warranty policy.
                            </div>
                        </CardContent>
                    </Card>

                    {/* Critical Overrides & Hard Controls */}
                    <Card className="col-span-full md:col-span-4">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Critical Overrides & Hard Controls</CardTitle>
                                <CardDescription>Admin level system interventions (Audited).</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="h-8 shadow-sm hover:bg-slate-50 transition-all active:scale-95" onClick={() => router.push("/audit")}>
                                <Icons.history className="mr-2 h-3 w-3 text-blue-600" /> Full Audit
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="text-[10px]">
                                            <TableHead>TIMESTAMP</TableHead>
                                            <TableHead>ACTION</TableHead>
                                            <TableHead>REASON / DETAIL</TableHead>
                                            <TableHead className="text-right">APPROVAL</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[
                                            { time: "Today, 11:20", action: "Machine Unlock", detail: "Sharma Graphics - Direct Negotiated", auth: "Admin Self" },
                                            { time: "Yesterday, 14:45", action: "Price Override", detail: "Lotus X1 - Discount 18% (Bulk Deal)", auth: "Admin Self" },
                                            { time: "01 May, 09:12", action: "Lead Reassign", detail: "15 Leads from Rep-A to Rep-C", auth: "Conflict" },
                                            { time: "28 Apr, 16:30", action: "Threshold Change", detail: "Auto-approve limit set to 12%", auth: "Global" },
                                        ].map((row, i) => (
                                            <TableRow key={i} className="text-xs">
                                                <TableCell className="text-muted-foreground">{row.time}</TableCell>
                                                <TableCell className="font-bold">{row.action}</TableCell>
                                                <TableCell>{row.detail}</TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant="outline" className="text-[8px] uppercase">{row.auth}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="p-4 border border-dashed rounded-lg bg-red-50/20">
                                    <p className="text-[10px] font-bold text-red-600 uppercase mb-2">Security Warning</p>
                                    <p className="text-[10px] text-muted-foreground italic">
                                        All administrative overrides are immutable and permanently hashed in the global audit ledger. Any unauthorized access triggers immediate system lockdown.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div >
    );
}

