"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PendingQuote {
    id: string;
    quoteNumber: string;
    leadId: string;
    customerName: string;
    companyName: string;
    requestedBy: string;
    amount: number;
    discount: number;
    discountAmount: number;
    reason: string;
    submittedDate: string;
    status: "pending" | "approved" | "rejected";
}

const MOCK_PENDING: PendingQuote[] = [
    {
        id: "1",
        quoteNumber: "Q-2024-089",
        leadId: "L-101",
        customerName: "Rajesh Kumar",
        companyName: "Pixel Printers",
        requestedBy: "Rahul Sales",
        amount: 850000,
        discount: 12,
        discountAmount: 102000,
        reason: "Bulk order commitment - 2 machines",
        submittedDate: "2024-05-15",
        status: "pending"
    },
    {
        id: "2",
        quoteNumber: "Q-2024-085",
        leadId: "L-098",
        customerName: "Anita Sharma",
        companyName: "Sharma Graphics",
        requestedBy: "Priya Sales",
        amount: 625000,
        discount: 11,
        discountAmount: 68750,
        reason: "Competitive pricing match request",
        submittedDate: "2024-05-14",
        status: "pending"
    },
];

export default function ApprovalsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [quotes, setQuotes] = useState(MOCK_PENDING);
    const [selectedQuote, setSelectedQuote] = useState<PendingQuote | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);

    // Check if user has approval permissions
    if (user?.role !== "super_admin" && user?.role !== "sales_manager") {
        return (
            <div className="flex items-center justify-center h-screen">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground">You don't have permission to access this page.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleApprove = (quote: PendingQuote) => {
        setQuotes(quotes.map(q =>
            q.id === quote.id ? { ...q, status: "approved" } : q
        ));
        toast.success(`Quote ${quote.quoteNumber} approved!`);
    };

    const handleReject = (quote: PendingQuote) => {
        if (!rejectionReason.trim()) {
            toast.error("Please provide a rejection reason");
            return;
        }

        setQuotes(quotes.map(q =>
            q.id === quote.id ? { ...q, status: "rejected" } : q
        ));
        toast.success(`Quote ${quote.quoteNumber} rejected`);
        setDialogOpen(false);
        setRejectionReason("");
        setSelectedQuote(null);
    };

    const openRejectDialog = (quote: PendingQuote) => {
        setSelectedQuote(quote);
        setDialogOpen(true);
    };

    const pendingQuotes = quotes.filter(q => q.status === "pending");
    const approvedQuotes = quotes.filter(q => q.status === "approved");
    const rejectedQuotes = quotes.filter(q => q.status === "rejected");

    const QuoteCard = ({ quote }: { quote: PendingQuote }) => (
        <Card key={quote.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{quote.quoteNumber}</CardTitle>
                            {quote.discount > 10 ? (
                                <Badge variant="destructive" className="animate-pulse">High Risk</Badge>
                            ) : (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">Standard</Badge>
                            )}
                        </div>
                        <CardDescription className="mt-1">
                            {quote.customerName} • {quote.companyName}
                        </CardDescription>
                        <p className="text-xs text-muted-foreground mt-1">
                            Requested by: {quote.requestedBy} • {quote.submittedDate}
                        </p>
                    </div>
                    {quote.status === "pending" && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            Pending Review
                        </Badge>
                    )}
                    {quote.status === "approved" && (
                        <Badge className="bg-green-500">Approved</Badge>
                    )}
                    {quote.status === "rejected" && (
                        <Badge variant="destructive">Rejected</Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-muted-foreground">Quote Amount:</span>
                        <p className="font-semibold text-lg">₹ {quote.amount.toLocaleString()}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Discount Applied:</span>
                        <p className="font-semibold text-lg text-red-600">{quote.discount}%</p>
                    </div>
                </div>

                <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium mb-1">Discount Justification:</p>
                    <p className="text-sm text-muted-foreground">{quote.reason}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-sm">
                        <span className="text-muted-foreground">Discount Amount: </span>
                        <span className="font-semibold text-red-600">₹ {quote.discountAmount.toLocaleString()}</span>
                    </div>
                </div>

                {quote.status === "pending" && (
                    <div className="flex gap-2 pt-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                                toast.info(`Viewing transaction history for ${quote.quoteNumber}`);
                                router.push(`/quotes/${quote.id}`);
                            }}
                        >
                            <Icons.view className="mr-2 h-4 w-4" />
                            Audit Trail
                        </Button>
                        <Button
                            variant="outline"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => openRejectDialog(quote)}
                        >
                            <Icons.warning className="mr-2 h-4 w-4" />
                            Reject
                        </Button>
                        <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(quote)}
                        >
                            <Icons.check className="mr-2 h-4 w-4" />
                            Approve
                        </Button>
                    </div>
                )}

                {quote.status === "approved" && (
                    <div className="pt-2">
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => {
                                toast.success(`PI Generated for ${quote.quoteNumber}`);
                                toast.info("Sent to Finance for invoicing.");
                            }}
                        >
                            <Icons.accounting className="mr-2 h-4 w-4" />
                            Convert to Proforma Invoice (PI)
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Approval Queue</h2>
                    <p className="text-muted-foreground">Review and approve discount requests</p>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2">
                    {pendingQuotes.length} Pending
                </Badge>
            </div>

            <Tabs defaultValue="pending" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="pending">
                        Pending
                        <Badge variant="secondary" className="ml-2">{pendingQuotes.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="approved">
                        Approved
                        <Badge variant="secondary" className="ml-2">{approvedQuotes.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="rejected">
                        Rejected
                        <Badge variant="secondary" className="ml-2">{rejectedQuotes.length}</Badge>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4">
                    {pendingQuotes.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6 text-center text-muted-foreground">
                                No pending approvals. All caught up! 🎉
                            </CardContent>
                        </Card>
                    ) : (
                        pendingQuotes.map(quote => <QuoteCard key={quote.id} quote={quote} />)
                    )}
                </TabsContent>

                <TabsContent value="approved" className="space-y-4">
                    {approvedQuotes.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6 text-center text-muted-foreground">
                                No approved quotes yet.
                            </CardContent>
                        </Card>
                    ) : (
                        approvedQuotes.map(quote => <QuoteCard key={quote.id} quote={quote} />)
                    )}
                </TabsContent>

                <TabsContent value="rejected" className="space-y-4">
                    {rejectedQuotes.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6 text-center text-muted-foreground">
                                No rejected quotes.
                            </CardContent>
                        </Card>
                    ) : (
                        rejectedQuotes.map(quote => <QuoteCard key={quote.id} quote={quote} />)
                    )}
                </TabsContent>
            </Tabs>

            {/* Rejection Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Quote</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting {selectedQuote?.quoteNumber}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Rejection Reason</Label>
                            <Textarea
                                placeholder="e.g., Discount exceeds policy, insufficient justification..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={() => selectedQuote && handleReject(selectedQuote)}
                        >
                            Confirm Rejection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
