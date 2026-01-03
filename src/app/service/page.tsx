"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { useState } from "react";

const MOCK_TICKETS = [
    { id: "SR-501", customer: "Singh Graphics", issue: "Printhead Clogging", status: "open", engineer: "Unassigned", date: "2024-05-02" },
    { id: "SR-498", customer: "Pixel Printers", issue: "Software License Error", status: "assigned", engineer: "Rahul Verma", date: "2024-05-01" },
    { id: "SR-480", customer: "Super Flex", issue: "Installation Request", status: "closed", engineer: "Amit Sharma", date: "2024-04-28" },
];

import { CreateTicketDialog } from "@/components/service/create-ticket-dialog";

import { useAuth } from "@/providers/auth-provider";

export default function ServicePage() {
    const { user } = useAuth();
    const isCustomer = user?.role === "customer";
    const isEngineer = user?.role === "service_engineer";
    // Sales Rep cannot create tickets
    const canCreateTicket = user?.role !== "senior_sales_rep";

    const [tickets, setTickets] = useState(MOCK_TICKETS);

    const filteredTickets = isCustomer
        ? tickets.filter(t => t.customer === user?.name)
        : tickets;

    if (isCustomer && filteredTickets.length === 0) {
        filteredTickets.push({ id: "SR-501", customer: user?.name || "Customer", issue: "Printhead Clogging", status: "open", engineer: "Unassigned", date: "2024-05-02" });
    }

    const handleAction = (ticketId: string, action: string) => {
        setTickets(prev => prev.map(t => {
            if (t.id === ticketId) {
                if (action === 'start') return { ...t, status: 'assigned', engineer: user?.name || 'Current User' };
                if (action === 'complete') return { ...t, status: 'closed' };
            }
            return t;
        }));

        if (action === 'start') toast.success(`Working started on ${ticketId}. Customer notified.`);
        if (action === 'complete') toast.success(`Ticket ${ticketId} marked as fixed. Sent for customer verification.`);
    };

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl md:text-3xl font-bold tracking-tight">Service & Support</h2>
                {canCreateTicket && (
                    <div className="w-full sm:w-auto">
                        <CreateTicketDialog />
                    </div>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Service Requests</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b-2">
                                    <TableHead className="w-[100px] font-bold">Ticket ID</TableHead>
                                    <TableHead className="min-w-[150px] font-bold">Customer</TableHead>
                                    <TableHead className="min-w-[200px] font-bold">Issue Details</TableHead>
                                    <TableHead className="min-w-[100px] font-bold">Status</TableHead>
                                    <TableHead className="min-w-[120px] font-bold">Engineer</TableHead>
                                    <TableHead className="min-w-[100px] font-bold">Date</TableHead>
                                    <TableHead className="text-right min-w-[150px] font-bold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTickets.map((ticket) => (
                                    <TableRow key={ticket.id}>
                                        <TableCell className="font-medium">{ticket.id}</TableCell>
                                        <TableCell>{ticket.customer}</TableCell>
                                        <TableCell>{ticket.issue}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                ticket.status === 'open' ? 'destructive' :
                                                    ticket.status === 'assigned' ? 'outline' : 'secondary'
                                            }>
                                                {ticket.status.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{ticket.engineer}</TableCell>
                                        <TableCell>{new Date(ticket.date).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => toast.info(`Opening Ticket Details: ${ticket.id}`)}>Manage</Button>

                                            {isEngineer && ticket.status === 'open' && (
                                                <Button variant="outline" size="sm" className="bg-blue-50 text-blue-700 border-blue-200" onClick={() => handleAction(ticket.id, 'start')}>
                                                    Start Work
                                                </Button>
                                            )}

                                            {isEngineer && ticket.status === 'assigned' && (
                                                <Button variant="outline" size="sm" className="bg-green-50 text-green-700 border-green-200" onClick={() => handleAction(ticket.id, 'complete')}>
                                                    Fix & Complete
                                                </Button>
                                            )}

                                            {isCustomer && ticket.status === 'assigned' && (
                                                <Button variant="outline" size="sm" className="text-green-600 border-green-200" onClick={() => toast.success("Confirmation Received: Ticket marked for closure. Thank you!")}>
                                                    Confirm Fixed
                                                </Button>
                                            )}
                                            {isCustomer && ticket.status === 'closed' && (
                                                <Button variant="ghost" size="sm" className="text-red-600" onClick={() => toast.warning("Re-opening ticket. Engineer informed of persistent issue.")}>
                                                    Re-open
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
