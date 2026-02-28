"use client";

import { useState } from "react";
import {
    IndianRupee,
    Search,
    Download,
    FileText,
    Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

/* ── Inline mock data ── */

const mockPayments = [
    { id: "p1", client_name: "John Doe", service_name: "PAN Card Application", amount: 590, status: "completed", method: "Cash", date: "2026-02-25T14:30:00Z", reference: "CASH-RECPT01" },
    { id: "p2", client_name: "Rahul Sharma", service_name: "Income Tax Filing", amount: 1178.82, status: "completed", method: "Net Banking (Razorpay)", date: "2026-02-18T16:00:00Z", reference: "pay_K8L9mN2p" },
    { id: "p3", client_name: "Sneha Gupta", service_name: "Driving License Renewal", amount: 708, status: "completed", method: "Credit Card (Razorpay)", date: "2026-02-15T11:00:00Z", reference: "pay_J7L8mO1q" },
    { id: "p4", client_name: "Amit Patel", service_name: "Aadhaar Update", amount: 236, status: "failed", method: "UPI (Razorpay)", date: "2026-02-12T09:45:00Z", reference: "pay_FAIL12XX" },
    { id: "p5", client_name: "Vikram Singh", service_name: "GST Registration", amount: 2360, status: "pending", method: "UPI (Razorpay)", date: "2026-02-08T13:00:00Z", reference: "pay_M9N8pQ2r" },
];

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(amount);
}

function formatDateTime(dateStr: string) {
    return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", hour: '2-digit', minute: '2-digit' }).format(new Date(dateStr));
}

export default function PaymentHistoryPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPayments = mockPayments.filter((p) =>
        p.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.reference.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalCollected = mockPayments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header section with title */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <IndianRupee className="h-8 w-8 text-emerald-600" />
                        Payment History
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Track payments made by clients for your requested services.
                    </p>
                </div>
                <Button variant="outline" className="shrink-0 gap-2">
                    <Download className="h-4 w-4" /> Export Report
                </Button>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-center space-y-4">
                    <div className="flex items-center gap-2 text-emerald-600 mb-2">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <IndianRupee className="h-5 w-5" />
                        </div>
                        <span className="font-medium text-sm text-foreground">Total Collected</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <h2 className="text-4xl font-bold tracking-tight text-foreground">
                            {formatCurrency(totalCollected)}
                        </h2>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-center space-y-4">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="h-5 w-5" />
                        </div>
                        <span className="font-medium text-sm text-foreground">Paid Services</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <h2 className="text-4xl font-bold tracking-tight text-foreground">
                            {mockPayments.filter(p => p.status === 'completed').length}
                        </h2>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-center space-y-4">
                    <div className="flex items-center gap-2 text-violet-600 mb-2">
                        <div className="p-2 bg-violet-100 rounded-lg">
                            <Users className="h-5 w-5" />
                        </div>
                        <span className="font-medium text-sm text-foreground">Active Clients</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <h2 className="text-4xl font-bold tracking-tight text-foreground">
                            {new Set(mockPayments.filter(p => p.status === 'completed').map(p => p.client_name)).size}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between pt-4 gap-4 items-center">
                    <h2 className="text-xl font-semibold">Client Payments</h2>
                    <div className="relative w-full sm:w-auto min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by client, service, or ref..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-card"
                        />
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead className="w-[140px]">Date</TableHead>
                                <TableHead>Client & Service</TableHead>
                                <TableHead>Payment Method</TableHead>
                                <TableHead>Reference ID</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPayments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        No payments found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPayments.map((p) => (
                                    <TableRow key={p.id} className="hover:bg-muted/50">
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatDateTime(p.date)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{p.client_name}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5">{p.service_name}</div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {p.method}
                                        </TableCell>
                                        <TableCell className="text-sm font-mono text-muted-foreground">
                                            {p.reference}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                p.status === "completed" ? "default" :
                                                    p.status === "pending" ? "secondary" : "destructive"
                                            } className={
                                                p.status === "completed" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" :
                                                    p.status === "pending" ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : ""
                                            }>
                                                {p.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold whitespace-nowrap">
                                            {formatCurrency(p.amount)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
