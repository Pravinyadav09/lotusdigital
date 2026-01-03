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
import { useGeofence } from "@/providers/geofence-provider";
import dynamic from "next/dynamic";

const OSMMap = dynamic(() => import("@/components/maps/osm-map"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-200 animate-pulse flex items-center justify-center">Loading Satellite Feed...</div>
});
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
    const { visitLogs } = useGeofence();
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
                    { title: "My Open Leads", value: "8", icon: Icons.leads, description: "3 need follow-up", color: "text-blue-500" },
                    { title: "Today's Visits", value: "3", icon: Icons.location, description: "2 verified check-ins", color: "text-orange-500" },
                    { title: "Quote Submissions", value: "5", icon: Icons.quotes, description: "2 pending manager", color: "text-amber-500" },
                    { title: "Target Achieved", value: "₹22L", icon: Icons.check, description: "44% of monthly target", color: "text-green-500" },
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
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl md:text-3xl font-bold tracking-tight">Welcome, {user?.name}!</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] sm:text-xs">
                            {user?.role?.replace(/_/g, " ").toUpperCase()}
                        </Badge>
                        <div className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            Session Active
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Date Range Filter Mock */}
                    {(user?.role === "super_admin" || user?.role === "sales_manager") && (
                        <div className="hidden lg:flex items-center space-x-2 mr-2">
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

                    <Button variant="outline" size="icon" className="h-9 w-9 relative shrink-0" onClick={() => toast.info("No new notifications")}>
                        <Icons.bell className="h-4 w-4" />
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600 border border-background" />
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 md:flex-none h-9" onClick={() => router.push("/reports")}>
                        <Icons.reports className="mr-2 h-4 w-4" />
                        <span className="text-xs sm:text-sm">Reports</span>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="shadow-sm border-blue-50/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 pb-1 sm:pb-2">
                            <CardTitle className="text-[10px] sm:text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4 pt-1 sm:pt-2">
                            <div className="text-base sm:text-2xl font-bold">{stat.value}</div>
                            <p className="text-[8px] sm:text-xs text-muted-foreground truncate">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-full md:col-span-4 shadow-sm border-blue-100/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg md:text-xl">
                            {user?.role === "customer" ? "My Quotations" :
                                user?.role === "senior_sales_rep" ? "Today's Visit Schedule" :
                                    "Sales Pipeline"}
                        </CardTitle>
                        <CardDescription className="text-xs">
                            {user?.role === "customer"
                                ? "View your quotation history"
                                : user?.role === "senior_sales_rep"
                                    ? "Your assigned customer visits for today"
                                    : "Overview of team performance and deals"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {user?.role === "sales_manager" || user?.role === "super_admin" ? (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span>Leads (45)</span>
                                            <span className="font-bold">₹ 2.4 Cr</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-blue-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 w-[100%]" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span>Quotes (12)</span>
                                            <span className="font-bold">₹ 85 L</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-amber-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 w-[40%]" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span>Deals Won (5)</span>
                                            <span className="font-bold">₹ 32 L</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-green-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 w-[15%]" />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t">
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-xs text-blue-700">RS</div>
                                                    <div>
                                                        <p className="font-medium">Rahul Sales</p>
                                                        <p className="text-[10px] text-muted-foreground italic">Target: ₹25L</p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="text-[10px] text-green-600 bg-green-50">112%</Badge>
                                            </div>
                                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                <div className="h-full bg-green-500 w-[100%]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : user?.role === "senior_sales_rep" ? (
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-3 border rounded-lg bg-muted/50">
                                    <div className="flex flex-col items-center justify-center h-10 w-10 rounded bg-blue-100 text-blue-700 font-bold shrink-0">
                                        <span className="text-xs">10</span>
                                        <span className="text-[8px] uppercase">AM</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">Pixel Printers - Demo</p>
                                        <p className="text-[10px] text-muted-foreground truncate">Okhla Phase III</p>
                                    </div>
                                    <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => router.push("/visits")}>
                                        Start
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-20 flex items-center justify-center text-muted-foreground text-xs italic">
                                Loading latest workspace updates...
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="col-span-full md:col-span-3">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg md:text-xl">
                            {user?.role === "customer" ? "Alerts" : "Activity"}
                        </CardTitle>
                        <CardDescription className="text-xs">Latest workspace updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium leading-none truncate">New Quote Generated</p>
                                        <p className="text-[10px] text-muted-foreground truncate">For Lotus Press - ₹12.5L</p>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground whitespace-nowrap">{1 + i}h ago</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Manager Quote Approvals (Clause 4.2) */}
            {(user?.role === "super_admin" || user?.role === "sales_manager") && (
                <div className="grid gap-4 md:grid-cols-1">
                    <Card className="border-amber-200 bg-amber-50/20">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-amber-800">Pending Price Approvals</CardTitle>
                                <CardDescription>Quotes exceeding 7.5% discount threshold requiring manual override.</CardDescription>
                            </div>
                            <Badge className="bg-amber-600 text-white animate-pulse">3 PENDING</Badge>
                        </CardHeader>
                        <CardContent>
                            {/* Mobile View: Stacked Cards */}
                            <div className="md:hidden space-y-4">
                                {[
                                    { id: "QT-2024-882", cust: "Sharma Graphics", val: "₹ 12.5L", disc: "12% (₹ 1.5L)", req: "Vikram Singh" },
                                    { id: "QT-2024-890", cust: "Pixel Printers", val: "₹ 8.2L", disc: "10% (₹ 82k)", req: "Amit Kumar" },
                                    { id: "QT-2024-895", cust: "Rapid Press", val: "₹ 24.0L", disc: "15% (₹ 3.6L)", req: "Vikram Singh" },
                                    { id: "QT-2024-899", cust: "Zenith Press", val: "₹ 18.5L", disc: "9% (₹ 1.6L)", req: "Neha Sharma" },
                                    { id: "QT-2024-902", cust: "Global Colors", val: "₹ 6.0L", disc: "8% (₹ 48k)", req: "Amit Kumar" },
                                    { id: "QT-2024-915", cust: "Print Hub", val: "₹ 32.0L", disc: "11% (₹ 3.5L)", req: "Vikram Singh" },
                                ].map((q) => (
                                    <div key={q.id} className="bg-white p-4 rounded-lg border border-amber-200 shadow-sm space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-amber-900">{q.cust}</h4>
                                                <p className="text-xs text-muted-foreground font-mono">{q.id}</p>
                                            </div>
                                            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 font-bold">
                                                {q.disc} OFF
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 py-2 border-y border-dashed border-amber-100">
                                            <div>
                                                <p className="text-[10px] uppercase text-muted-foreground font-bold">Value</p>
                                                <p className="font-semibold">{q.val}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] uppercase text-muted-foreground font-bold">Requested By</p>
                                                <p className="font-semibold">{q.req}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1 h-9 border-red-200 text-red-700 hover:bg-red-50"
                                                onClick={() => toast.error(`Quote ${q.id} Rejected. Sales rep notified.`)}
                                            >
                                                Reject
                                            </Button>
                                            <Button
                                                className="flex-1 h-9 bg-green-600 hover:bg-green-700"
                                                onClick={() => toast.success(`Quote ${q.id} Approved! Moved to PI stage.`)}
                                            >
                                                Approve
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop View: Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <Table className="min-w-[600px]">
                                    <TableHeader>
                                        <TableRow className="bg-amber-100/50">
                                            <TableHead className="font-bold text-amber-900">Quote ID</TableHead>
                                            <TableHead className="font-bold text-amber-900">Customer</TableHead>
                                            <TableHead className="font-bold text-amber-900">Value</TableHead>
                                            <TableHead className="font-bold text-amber-900">Discount</TableHead>
                                            <TableHead className="font-bold text-amber-900">Requested By</TableHead>
                                            <TableHead className="text-right font-bold text-amber-900">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[
                                            { id: "QT-2024-882", cust: "Sharma Graphics", val: "₹ 12.5L", disc: "12% (₹ 1.5L)", req: "Vikram Singh" },
                                            { id: "QT-2024-890", cust: "Pixel Printers", val: "₹ 8.2L", disc: "10% (₹ 82k)", req: "Amit Kumar" },
                                            { id: "QT-2024-895", cust: "Rapid Press", val: "₹ 24.0L", disc: "15% (₹ 3.6L)", req: "Vikram Singh" },
                                            { id: "QT-2024-899", cust: "Zenith Press", val: "₹ 18.5L", disc: "9% (₹ 1.6L)", req: "Neha Sharma" },
                                            { id: "QT-2024-902", cust: "Global Colors", val: "₹ 6.0L", disc: "8% (₹ 48k)", req: "Amit Kumar" },
                                            { id: "QT-2024-915", cust: "Print Hub", val: "₹ 32.0L", disc: "11% (₹ 3.5L)", req: "Vikram Singh" },
                                        ].map((q) => (
                                            <TableRow key={q.id}>
                                                <TableCell className="font-medium">{q.id}</TableCell>
                                                <TableCell>{q.cust}</TableCell>
                                                <TableCell>{q.val}</TableCell>
                                                <TableCell className="text-red-600 font-bold">{q.disc}</TableCell>
                                                <TableCell>{q.req}</TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button size="sm" variant="outline" className="h-7 text-xs border-red-200 text-red-700 hover:bg-red-50" onClick={() => toast.error(`Quote ${q.id} Rejected. Sales rep notified.`)}>
                                                        Reject
                                                    </Button>
                                                    <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700" onClick={() => toast.success(`Quote ${q.id} Approved! Moved to PI stage.`)}>
                                                        Approve
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Admin & Manager Deep Dive: Sales & Field Operations */}
            {
                (user?.role === "super_admin" || user?.role === "sales_manager") && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        {/* Visual Sales Funnel */}
                        <Card className="col-span-full md:col-span-4">
                            <CardHeader>
                                <CardTitle className="text-base md:text-xl leading-tight">Enterprise Sales Funnel (Deep Dive)</CardTitle>
                                <CardDescription className="text-xs md:text-sm break-words">Real-time conversion metrics across India regions.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 p-2 sm:p-6">
                                <div className="space-y-4">
                                    {[
                                        { stage: "Total Leads Discovered", count: 452, value: "₹ 8.4 Cr", width: "100%", color: "bg-blue-500", icon: Icons.leads },
                                        { stage: "Qualified & Demo Done", count: 120, value: "₹ 4.2 Cr", width: "70%", color: "bg-indigo-500", icon: Icons.view },
                                        { stage: "Quotations Issued", count: 85, value: "₹ 3.1 Cr", width: "50%", color: "bg-violet-500", icon: Icons.quotes },
                                        { stage: "PI Generated & Advanced", count: 42, value: "₹ 1.8 Cr", width: "35%", color: "bg-purple-500", icon: Icons.accounting },
                                        { stage: "Final Deal Closed", count: 28, value: "₹ 1.2 Cr", width: "20%", color: "bg-emerald-500", icon: Icons.check },
                                    ].map((step) => (
                                        <div key={step.stage} className="space-y-1">
                                            <div className="flex justify-between items-center text-[10px] sm:text-xs">
                                                <div className="flex items-center gap-2 font-medium overflow-hidden">
                                                    <step.icon className="h-3 w-3 shrink-0" />
                                                    <span className="truncate whitespace-nowrap">{step.stage} <span className="text-muted-foreground text-[8px] sm:text-[10px] hidden sm:inline">({step.count})</span></span>
                                                </div>
                                                <span className="font-bold ml-2 text-[10px] sm:text-xs">{step.value}</span>
                                            </div>
                                            <div className="h-2 sm:h-3 w-full bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${step.color} transition-all duration-1000 ease-in-out`}
                                                    style={{ width: step.width }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-1 gap-1 border-t pt-3 text-center">
                                    <div className="flex flex-wrap items-center justify-around gap-2">
                                        <div className="flex-1 min-w-[80px] p-2 bg-muted/30 rounded-lg">
                                            <p className="text-[8px] text-muted-foreground uppercase font-bold">Conv.</p>
                                            <p className="text-sm font-bold">6.2%</p>
                                        </div>
                                        <div className="flex-1 min-w-[80px] p-2 bg-muted/30 rounded-lg">
                                            <p className="text-[8px] text-muted-foreground uppercase font-bold">Size</p>
                                            <p className="text-sm font-bold">₹14.2L</p>
                                        </div>
                                        <div className="flex-1 min-w-[80px] p-2 bg-muted/30 rounded-lg">
                                            <p className="text-[8px] text-muted-foreground uppercase font-bold">Cycle</p>
                                            <p className="text-sm font-bold">24d</p>
                                        </div>
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
                                {/* Mobile View: Stacked Cards */}
                                <div className="md:hidden space-y-4">
                                    {(visitLogs.length > 0 ? visitLogs.slice(0, 4) : [
                                        { id: "1", name: "Rahul Singh", loc: "Okhla Ph-III", task: "Demo", status: "Verified", time: "10:15 AM", dist: "12m", visitId: "VST-101", timestamp: new Date().toISOString() },
                                        { id: "2", name: "Amit Kumar", loc: "Naraina Ind.", task: "Closing", status: "Verified", time: "11:30 AM", dist: "45m", visitId: "VST-102", timestamp: new Date().toISOString() },
                                        { id: "3", name: "Neha Sharma", loc: "Sector 62, Noida", task: "Payment", status: "Warning", time: "12:10 PM", dist: "850m", visitId: "VST-103", timestamp: new Date().toISOString() },
                                        { id: "4", name: "Vikram Ad.", loc: "Manesar", task: "Installation", status: "Verified", time: "12:45 PM", dist: "5m", visitId: "VST-104", timestamp: new Date().toISOString() },
                                        { id: "5", name: "Rohan Das", loc: "Gurgaon Sec-14", task: "Service", status: "Verified", time: "01:15 PM", dist: "20m", visitId: "VST-105", timestamp: new Date().toISOString() },
                                        { id: "6", name: "Priya Singh", loc: "Faridabad", task: "Audit", status: "Failed", time: "02:30 PM", dist: "1.2km", visitId: "VST-106", timestamp: new Date().toISOString() },
                                        { id: "7", name: "Karan Johar", loc: "Delhi Cantt", task: "Meeting", status: "Verified", time: "03:45 PM", dist: "8m", visitId: "VST-107", timestamp: new Date().toISOString() },
                                        { id: "8", name: "Simran Kaur", loc: "Noida Sec-18", task: "Sales", status: "Verified", time: "04:20 PM", dist: "15m", visitId: "VST-108", timestamp: new Date().toISOString() },
                                    ]).map((log, i) => (
                                        <div key={i} className="bg-white p-3 rounded-lg border shadow-sm space-y-2">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-2 w-2 rounded-full ${String(log.status).toLowerCase() === 'verified' ? 'bg-green-500' : 'bg-red-500 animate-ping'}`} />
                                                    <div>
                                                        <p className="font-bold text-sm">{(log as any).name || "Field Rep"}</p>
                                                        <p className="text-[10px] text-muted-foreground">{(log as any).task || "Field Check-in"}</p>
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-[9px] px-1 h-4 ${String(log.status).toLowerCase() === 'verified' ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-700 bg-red-50 border-red-200'}`}
                                                >
                                                    {String(log.status).toUpperCase()}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center text-xs pl-4 border-l-2 border-muted ml-0.5">
                                                <div>
                                                    <p className="font-medium">{(log as any).loc || `Site: ${log.visitId}`}</p>
                                                    <p className="text-[9px] text-muted-foreground">{(log as any).time || new Date(log.timestamp).toLocaleTimeString()}</p>
                                                </div>
                                                <div className="text-right font-mono font-bold text-slate-600">
                                                    {(log as any).dist || (log as any).distance}m
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop View: Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <Table className="min-w-[500px]">
                                        <TableHeader>
                                            <TableRow className="text-[10px] uppercase bg-muted/30">
                                                <TableHead className="min-w-[120px] font-bold">Rep Name</TableHead>
                                                <TableHead className="min-w-[150px] font-bold">Location / Task</TableHead>
                                                <TableHead className="min-w-[100px] font-bold">Status</TableHead>
                                                <TableHead className="text-right min-w-[80px] font-bold">Dist.</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {visitLogs.length > 0 ? (
                                                visitLogs.slice(0, 4).map((log, i) => (
                                                    <TableRow key={log.id} className="text-xs">
                                                        <TableCell className="font-bold whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`h-1.5 w-1.5 rounded-full ${log.status === 'verified' ? 'bg-green-500' : 'bg-red-500 animate-ping'}`} />
                                                                Field Rep Check-in
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap">
                                                            <p className="font-medium text-[10px]">Site: {log.visitId}</p>
                                                            <p className="text-[9px] text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</p>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className={`text-[8px] px-1 h-4 ${log.status === 'verified' ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-700 bg-red-50 border-red-200'}`}>
                                                                {log.status.toUpperCase()}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono text-[10px]">{log.distance}m</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                [
                                                    { name: "Rahul Singh", loc: "Okhla Ph-III", task: "Demo", status: "Verified", time: "10:15 AM", dist: "12m" },
                                                    { name: "Amit Kumar", loc: "Naraina Ind.", task: "Closing", status: "Verified", time: "11:30 AM", dist: "45m" },
                                                    { name: "Neha Sharma", loc: "Sector 62, Noida", task: "Payment", status: "Warning", time: "12:10 PM", dist: "850m" },
                                                    { name: "Vikram Ad.", loc: "Manesar", task: "Installation", status: "Verified", time: "12:45 PM", dist: "5m" },
                                                    { name: "Rohan Das", loc: "Gurgaon Sec-14", task: "Service", status: "Verified", time: "01:15 PM", dist: "20m" },
                                                    { name: "Priya Singh", loc: "Faridabad", task: "Audit", status: "Failed", time: "02:30 PM", dist: "1.2km" },
                                                    { name: "Karan Johar", loc: "Delhi Cantt", task: "Meeting", status: "Verified", time: "03:45 PM", dist: "8m" },
                                                    { name: "Simran Kaur", loc: "Noida Sec-18", task: "Sales", status: "Verified", time: "04:20 PM", dist: "15m" },
                                                ].map((rep, i) => (
                                                    <TableRow key={i} className="text-xs">
                                                        <TableCell className="font-bold whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`h-1.5 w-1.5 rounded-full ${rep.status === 'Verified' ? 'bg-green-500' : 'bg-red-500 animate-ping'}`} />
                                                                {rep.name}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap">
                                                            <p className="font-medium text-[10px]">{rep.loc}</p>
                                                            <p className="text-[9px] text-muted-foreground">{rep.task} • {rep.time}</p>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className={`text-[8px] px-1 h-4 ${rep.status === 'Verified' ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-700 bg-red-50 border-red-200'}`}>
                                                                {rep.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono text-[10px]">{rep.dist}</TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                <Button
                                    variant="ghost"
                                    className="w-full text-xs text-blue-600 h-8 hover:bg-blue-50"
                                    onClick={() => setIsMapOpen(true)}
                                >
                                    <Icons.view className="mr-2 h-3 w-3" />
                                    View Master Field Map
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )
            }

            {/* Master Map Dialog */}
            <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
                <DialogContent className="max-w-4xl w-[95vw] sm:w-full h-[85vh] sm:h-[80vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
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
                    <div className="flex-1 bg-slate-200 relative overflow-hidden z-0">
                        <OSMMap
                            center={[28.6139, 77.2090]}
                            zoom={11}
                            geofences={useGeofence().geofences}
                            height="100%"
                        />

                        {/* Map Overlay Stats */}
                        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto grid grid-cols-3 gap-2 sm:gap-4 bg-white/95 backdrop-blur rounded-lg p-2 sm:p-4 shadow-xl border z-10">
                            <div className="text-center">
                                <p className="text-[8px] sm:text-[10px] text-muted-foreground font-bold">ACTIVE REPS</p>
                                <p className="text-sm sm:text-lg font-black">12</p>
                            </div>
                            <div className="text-center border-x px-2 sm:px-4">
                                <p className="text-[8px] sm:text-[10px] text-muted-foreground font-bold">AVG RADIUS</p>
                                <p className="text-sm sm:text-lg font-black text-green-600">32m</p>
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
            {
                user?.role === "super_admin" && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        {/* Revenue Mix Chart */}
                        <Card className="col-span-full md:col-span-3">
                            <CardHeader>
                                <CardTitle>Revenue Mix (3-Section Analysis)</CardTitle>
                                <CardDescription>Body vs Service vs Accessories contribution.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-2 sm:pt-4 h-auto min-h-[250px] relative p-2 sm:p-6">
                                {/* Mock Multi-Series Chart */}
                                <div className="flex items-end justify-between h-32 sm:h-40 gap-2 mt-4 px-2">
                                    {[
                                        { label: "Body", val: "75%", color: "bg-blue-600", amount: "₹3.2Cr" },
                                        { label: "Service", val: "15%", color: "bg-emerald-600", amount: "₹65L" },
                                        { label: "Acc.", val: "10%", color: "bg-amber-600", amount: "₹42L" },
                                    ].map((bar) => (
                                        <div key={bar.label} className="flex-1 flex flex-col items-center gap-1 sm:gap-2 group cursor-pointer">
                                            <div className="w-full bg-slate-100 rounded-md relative h-24 sm:h-40 flex items-end overflow-hidden max-w-[50px] mx-auto">
                                                <div
                                                    className={`w-full ${bar.color} rounded-t-md transition-all group-hover:opacity-80`}
                                                    style={{ height: bar.val }}
                                                />
                                                <div className="absolute top-1 w-full text-center text-[7px] font-bold opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity whitespace-nowrap">
                                                    {bar.amount}
                                                </div>
                                            </div>
                                            <span className="text-[8px] sm:text-xs font-medium truncate w-full text-center">{bar.label}</span>
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
                            <CardContent className="p-2 sm:p-6">
                                <div className="space-y-4">
                                    {/* Mobile View: Stacked Audit Cards */}
                                    <div className="md:hidden space-y-4">
                                        {[
                                            { time: "Today, 11:20", action: "Machine Unlock", detail: "Sharma Graphics - Direct Negotiated", auth: "Admin Self" },
                                            { time: "Yesterday, 14:45", action: "Price Override", detail: "Lotus X1 - Discount 18% (Bulk Deal)", auth: "Admin Self" },
                                            { time: "01 May, 09:12", action: "Lead Reassign", detail: "15 Leads from Rep-A to Rep-C", auth: "Conflict" },
                                            { time: "28 Apr, 16:30", action: "Threshold Change", detail: "Auto-approve limit set to 12%", auth: "Global" },
                                            { time: "25 Apr, 10:00", action: "New User", detail: "Added 'Rohit Team' to Sales", auth: "Admin Self" },
                                            { time: "22 Apr, 18:15", action: "System Update", detail: "Patch v2.1.4 deployed", auth: "System" },
                                            { time: "20 Apr, 12:45", action: "Data Export", detail: "Full SQL Dump for Q1", auth: "Admin Self" },
                                        ].map((row, i) => (
                                            <div key={i} className="bg-slate-50 p-3 rounded-lg border space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-bold text-xs text-slate-800">{row.action}</p>
                                                        <p className="text-[10px] text-muted-foreground">{row.time}</p>
                                                    </div>
                                                    <Badge variant="outline" className="text-[9px] uppercase bg-white border-slate-300">
                                                        {row.auth}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-100">
                                                    {row.detail}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Desktop View: Audit Table */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <Table className="min-w-[600px]">
                                            <TableHeader>
                                                <TableRow className="text-[10px] uppercase bg-muted/30">
                                                    <TableHead className="min-w-[120px] font-bold">TIMESTAMP</TableHead>
                                                    <TableHead className="min-w-[150px] font-bold">ACTION</TableHead>
                                                    <TableHead className="min-w-[200px] font-bold">REASON / DETAIL</TableHead>
                                                    <TableHead className="text-right min-w-[120px] font-bold">APPROVAL</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {[
                                                    { time: "Today, 11:20", action: "Machine Unlock", detail: "Sharma Graphics - Direct Negotiated", auth: "Admin Self" },
                                                    { time: "Yesterday, 14:45", action: "Price Override", detail: "Lotus X1 - Discount 18% (Bulk Deal)", auth: "Admin Self" },
                                                    { time: "01 May, 09:12", action: "Lead Reassign", detail: "15 Leads from Rep-A to Rep-C", auth: "Conflict" },
                                                    { time: "28 Apr, 16:30", action: "Threshold Change", detail: "Auto-approve limit set to 12%", auth: "Global" },
                                                    { time: "25 Apr, 10:00", action: "New User", detail: "Added 'Rohit Team' to Sales", auth: "Admin Self" },
                                                    { time: "22 Apr, 18:15", action: "System Update", detail: "Patch v2.1.4 deployed", auth: "System" },
                                                    { time: "20 Apr, 12:45", action: "Data Export", detail: "Full SQL Dump for Q1", auth: "Admin Self" },
                                                ].map((row, i) => (
                                                    <TableRow key={i} className="text-xs">
                                                        <TableCell className="text-muted-foreground whitespace-nowrap min-w-[100px]">{row.time}</TableCell>
                                                        <TableCell className="font-bold whitespace-nowrap min-w-[120px]">{row.action}</TableCell>
                                                        <TableCell className="min-w-[200px]">{row.detail}</TableCell>
                                                        <TableCell className="text-right min-w-[100px]">
                                                            <Badge variant="outline" className="text-[8px] uppercase">{row.auth}</Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
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
                )
            }
        </div >
    );
}

