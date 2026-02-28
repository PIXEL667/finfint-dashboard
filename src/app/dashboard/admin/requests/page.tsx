"use client";

import { useState } from "react";
import {
    FileText,
    Search,
    CheckCircle2,
    XCircle,
    Clock,
    Eye,
    Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

/* ── Inline mock data ── */

interface ServiceRequest {
    id: string;
    service_name: string;
    customer_name: string;
    customer_email: string;
    agent_name: string;
    kiosk_name: string;
    status: string;
    price: number;
    tax: number;
    total: number;
    required_documents: string[];
    uploaded_documents: string[];
    payment_status: string;
    created_at: string;
}

const initialRequests: ServiceRequest[] = [
    { id: "sr001", service_name: "PAN Card Application", customer_name: "John Doe", customer_email: "john@example.com", agent_name: "Priya Sharma", kiosk_name: "Downtown Kiosk", status: "pending_admin_approval", price: 500, tax: 90, total: 590, required_documents: ["ID Proof", "Address Proof", "Passport Photo"], uploaded_documents: ["ID Proof"], payment_status: "unpaid", created_at: "2026-02-10T09:30:00Z" },
    { id: "sr002", service_name: "Income Tax Filing", customer_name: "Rahul Sharma", customer_email: "rahul@example.com", agent_name: "Rahul Verma", kiosk_name: "Park Street Kiosk", status: "completed", price: 999, tax: 179.82, total: 1178.82, required_documents: ["Form 16", "Bank Statement"], uploaded_documents: ["Form 16", "Bank Statement"], payment_status: "paid", created_at: "2026-01-05T11:00:00Z" },
    { id: "sr003", service_name: "Passport Application", customer_name: "Amit Patel", customer_email: "amit@example.com", agent_name: "Priya Sharma", kiosk_name: "Downtown Kiosk", status: "pending_admin_approval", price: 1500, tax: 270, total: 1770, required_documents: ["Old Passport Copy", "Address Proof", "ID Proof"], uploaded_documents: [], payment_status: "unpaid", created_at: "2026-02-20T08:00:00Z" },
    { id: "sr004", service_name: "Driving License Renewal", customer_name: "Sneha Gupta", customer_email: "sneha@example.com", agent_name: "Neha Gupta", kiosk_name: "Mall Road Kiosk", status: "completed", price: 600, tax: 108, total: 708, required_documents: ["Old License Copy", "Address Proof"], uploaded_documents: ["Old License Copy", "Address Proof"], payment_status: "paid", created_at: "2025-12-12T10:30:00Z" },
    { id: "sr005", service_name: "GST Registration", customer_name: "Vikram Singh", customer_email: "vikram@example.com", agent_name: "Priya Sharma", kiosk_name: "Downtown Kiosk", status: "approved", price: 2000, tax: 360, total: 2360, required_documents: ["Business PAN", "Address Proof", "Bank Account Details"], uploaded_documents: ["Business PAN"], payment_status: "unpaid", created_at: "2026-02-15T13:00:00Z" },
    { id: "sr006", service_name: "Aadhaar Update", customer_name: "Sneha Gupta", customer_email: "sneha@example.com", agent_name: "Priya Sharma", kiosk_name: "Downtown Kiosk", status: "pending_admin_approval", price: 200, tax: 36, total: 236, required_documents: ["Old Aadhaar Copy", "Address Proof"], uploaded_documents: [], payment_status: "unpaid", created_at: "2026-02-27T10:00:00Z" },
];

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(amount);
}

function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(dateStr));
}

/* ── Component ── */

export default function RequestsPage() {
    const [requests, setRequests] = useState<ServiceRequest[]>(initialRequests);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [viewRequest, setViewRequest] = useState<ServiceRequest | null>(null);

    const statuses = [
        { id: "all", label: "All" },
        { id: "pending_admin_approval", label: "Pending" },
        { id: "approved", label: "Approved" },
        { id: "in_progress", label: "In Progress" },
        { id: "completed", label: "Completed" },
    ];

    const filtered = requests.filter(r => {
        const matchesSearch = r.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || r.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleApprove = (id: string) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r));
        toast.success("Request approved! Client can now upload documents.");
        setViewRequest(prev => prev ? { ...prev, status: "approved" } : prev);
    };

    const handleReject = (id: string) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "rejected" } : r));
        toast.info("Request has been rejected.");
        setViewRequest(prev => prev ? { ...prev, status: "rejected" } : prev);
    };

    const handlePaymentToggle = (id: string, current: string) => {
        const next = current === "paid" ? "unpaid" : "paid";
        setRequests(prev => prev.map(r => r.id === id ? { ...r, payment_status: next } : r));
        toast.success(`Payment marked as ${next}.`);
        setViewRequest(prev => prev ? { ...prev, payment_status: next } : prev);
    };

    const handleStatusUpdate = (id: string, newStatus: string) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
        // Also update view request immediately
        setViewRequest(prev => prev ? { ...prev, status: newStatus } : prev);

        let msg = "Status updated.";
        if (newStatus === "in_progress") msg = "Request moved to In Progress.";
        if (newStatus === "completed") msg = "Request marked as Completed! Agent commission credited.";
        toast.success(msg);
    };

    const getStatusBadge = (status: string) => {
        const map: Record<string, { class: string; label: string }> = {
            pending_admin_approval: { class: "bg-amber-100 text-amber-700", label: "Pending Approval" },
            approved: { class: "bg-blue-100 text-blue-700", label: "Approved" },
            in_progress: { class: "bg-violet-100 text-violet-700", label: "In Progress" },
            completed: { class: "bg-emerald-100 text-emerald-700", label: "Completed" },
            rejected: { class: "bg-red-100 text-red-700", label: "Rejected" },
        };
        const s = map[status] || { class: "bg-muted text-muted-foreground", label: status };
        return <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium ${s.class}`}>{s.label}</span>;
    };

    const pendingCount = requests.filter(r => r.status === "pending_admin_approval").length;

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <FileText className="h-8 w-8 text-violet-600" />
                    Service Requests
                </h1>
                <p className="text-muted-foreground mt-1">
                    Review, approve, or reject incoming service requests.
                    {pendingCount > 0 && (
                        <span className="ml-2 inline-flex items-center gap-1 text-amber-600 font-medium">
                            <Clock className="h-3.5 w-3.5" />
                            {pendingCount} pending approval
                        </span>
                    )}
                </p>
            </div>

            {/* Filters */}
            <div className="bg-card rounded-xl border border-border p-4 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search by name, service, or ID..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 bg-background" />
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">{filtered.length} results</div>
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    {statuses.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setStatusFilter(s.id)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${statusFilter === s.id
                                ? "bg-violet-600 text-white"
                                : "bg-background text-foreground border border-border hover:bg-muted"
                                }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Requests Table */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead>Service Request</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead className="hidden md:table-cell">Agent / Kiosk</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No requests found.</TableCell>
                            </TableRow>
                        ) : (
                            filtered.map(req => (
                                <TableRow key={req.id} className="hover:bg-muted/30 transition-colors group">
                                    <TableCell>
                                        <p className="font-medium">{req.service_name}</p>
                                        <p className="text-xs text-muted-foreground">{req.id.toUpperCase()} • {formatDate(req.created_at)}</p>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm">{req.customer_name}</p>
                                        <p className="text-xs text-muted-foreground">{req.customer_email}</p>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <p className="text-sm">{req.agent_name}</p>
                                        <p className="text-xs text-muted-foreground">{req.kiosk_name}</p>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(req.status)}</TableCell>
                                    <TableCell className="text-right font-semibold text-sm">{formatCurrency(req.total)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setViewRequest(req)}>
                                                <Eye className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* View Request Dialog */}
            <Dialog open={!!viewRequest} onOpenChange={open => { if (!open) setViewRequest(null); }}>
                <DialogContent className="sm:max-w-[550px]">
                    {viewRequest && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{viewRequest.service_name}</DialogTitle>
                                <DialogDescription>Request {viewRequest.id.toUpperCase()} • {formatDate(viewRequest.created_at)}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Client</p>
                                        <p className="font-medium">{viewRequest.customer_name}</p>
                                        <p className="text-xs text-muted-foreground">{viewRequest.customer_email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Agent</p>
                                        <p className="font-medium">{viewRequest.agent_name}</p>
                                        <p className="text-xs text-muted-foreground">{viewRequest.kiosk_name}</p>
                                    </div>
                                </div>

                                <div className="bg-muted/30 rounded-lg p-4 border border-border space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Base Price</span>
                                        <span>{formatCurrency(viewRequest.price)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Tax</span>
                                        <span>{formatCurrency(viewRequest.tax)}</span>
                                    </div>
                                    <div className="border-t border-border pt-2 flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span className="text-violet-600">{formatCurrency(viewRequest.total)}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Required Documents</p>
                                    <div className="space-y-1.5">
                                        {viewRequest.required_documents.map(doc => {
                                            const isUploaded = viewRequest.uploaded_documents.includes(doc);
                                            return (
                                                <div key={doc} className="flex items-center gap-2 text-sm">
                                                    {isUploaded ? (
                                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                    ) : (
                                                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                                                    )}
                                                    <span className={isUploaded ? "text-foreground" : "text-muted-foreground"}>{doc}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Status:</span>
                                    {getStatusBadge(viewRequest.status)}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Payment:</span>
                                    <Badge variant={viewRequest.payment_status === "paid" ? "default" : "secondary"}
                                        className={viewRequest.payment_status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                                        {viewRequest.payment_status === "paid" ? "Paid" : "Unpaid"}
                                    </Badge>
                                </div>
                            </div>
                            <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
                                {viewRequest.status === "pending_admin_approval" && (
                                    <div className="flex gap-2 w-full">
                                        <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleReject(viewRequest.id)}>
                                            <XCircle className="mr-2 h-4 w-4" /> Reject
                                        </Button>
                                        <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleApprove(viewRequest.id)}>
                                            <CheckCircle2 className="mr-2 h-4 w-4" /> Approve Docs
                                        </Button>
                                    </div>
                                )}

                                {viewRequest.status === "approved" && (
                                    <div className="flex flex-col gap-2 w-full">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() => handlePaymentToggle(viewRequest.id, viewRequest.payment_status)}
                                            >
                                                {viewRequest.payment_status === "paid" ? "Mark Unpaid" : "Verify Payment"}
                                            </Button>
                                            <Button
                                                className="flex-1 bg-violet-600 hover:bg-violet-700 text-white"
                                                onClick={() => handleStatusUpdate(viewRequest.id, "in_progress")}
                                                disabled={viewRequest.payment_status !== "paid"}
                                            >
                                                Begin Processing
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {viewRequest.status === "in_progress" && (
                                    <Button
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                        onClick={() => handleStatusUpdate(viewRequest.id, "completed")}
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Completed Setup
                                    </Button>
                                )}

                                {["completed", "rejected"].includes(viewRequest.status) && (
                                    <Button variant="outline" className="w-full" onClick={() => setViewRequest(null)}>Close</Button>
                                )}
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
