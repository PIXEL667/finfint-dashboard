"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Filter,
    Plus,
    FileText,
    Banknote,
    Calendar,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── Inline mock data ── */

const mockServices = [
    { id: "s1", name: "PAN Card Application", description: "Apply for a new PAN card or reprint. Required for income tax filings and financial transactions." },
    { id: "s2", name: "Aadhaar Update", description: "Update address, mobile number, or biometrics on your Aadhaar card." },
    { id: "s3", name: "Passport Application", description: "New passport application or passport renewal with document verification." },
    { id: "s4", name: "Income Tax Filing", description: "E-filing of personal or business income tax returns for the financial year." },
    { id: "s5", name: "GST Registration", description: "Register your business for Goods and Services Tax compliance." },
    { id: "s6", name: "Driving License Renewal", description: "Renew your driving license before or after expiry date through our kiosk." },
];

const mockServiceRequests = [
    { id: "sr001", service_id: "s1", service_name: "PAN Card Application", status: "in_progress", price_snapshot: 500, created_at: "2026-02-10T09:30:00Z" },
    { id: "sr002", service_id: "s4", service_name: "Income Tax Filing", status: "completed", price_snapshot: 999, created_at: "2026-01-05T11:00:00Z" },
    { id: "sr003", service_id: "s3", service_name: "Passport Application", status: "pending", price_snapshot: 1500, created_at: "2026-02-20T08:00:00Z" },
    { id: "sr004", service_id: "s6", service_name: "Driving License Renewal", status: "completed", price_snapshot: 600, created_at: "2025-12-12T10:30:00Z" },
    { id: "sr005", service_id: "s5", service_name: "GST Registration", status: "in_progress", price_snapshot: 2000, created_at: "2026-02-15T13:00:00Z" },
];

const mockDocuments = [
    { id: "d1", service_request_id: "sr001" },
    { id: "d2", service_request_id: "sr001" },
    { id: "d3", service_request_id: "sr002" },
    { id: "d4", service_request_id: "sr002" },
    { id: "d5", service_request_id: "sr005" },
];

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(amount);
}

function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(dateStr));
}

/* ── Component ── */

export default function RequestsPage() {
    const [filter, setFilter] = useState("all");

    const filteredRequests = mockServiceRequests.filter((req) =>
        filter === "all" ? true : req.status === filter
    );

    const statuses = [
        { id: "all", label: "All Requests" },
        { id: "pending", label: "Pending" },
        { id: "in_progress", label: "In-progress" },
        { id: "completed", label: "Completed" },
    ];

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    My Service Requests
                </h1>
                <p className="text-muted-foreground mt-1">
                    View and manage all your service requests
                </p>
            </div>

            {/* Filter Section */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-sm">Filter by Status</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {statuses.map((status) => (
                        <button
                            key={status.id}
                            onClick={() => setFilter(status.id)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === status.id
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background text-foreground border border-border hover:bg-muted"
                                }`}
                        >
                            {status.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* List Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-sm font-medium text-muted-foreground">
                    {filteredRequests.length} requests found
                </p>
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/dashboard/kiosk/request/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Request
                    </Link>
                </Button>
            </div>

            {/* Requests Grid */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {filteredRequests.map((req) => {
                    const service = mockServices.find(s => s.id === req.service_id);
                    const docsCount = mockDocuments.filter(d => d.service_request_id === req.id).length;

                    let badgeClass = "bg-muted text-muted-foreground";
                    if (req.status === "pending") badgeClass = "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-500";
                    if (req.status === "in_progress") badgeClass = "bg-primary/10 text-primary";
                    if (req.status === "completed") badgeClass = "bg-accent/15 text-accent-foreground";

                    const statusDisplay = req.status.split('_').map(word =>
                        word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ');

                    return (
                        <div key={req.id} className="bg-card rounded-xl border border-border shadow-sm flex flex-col">
                            <div className="p-6 flex-1 space-y-4">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <h3 className="font-semibold text-lg">{req.service_name}</h3>
                                        <p className="text-xs text-muted-foreground mt-1">ID: {req.id.toUpperCase()}</p>
                                    </div>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${badgeClass}`}>
                                        {statusDisplay}
                                    </span>
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {service?.description || "Service request details and processing information."}
                                </p>

                                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground pt-2">
                                    <div className="flex items-center gap-1.5">
                                        <FileText className="h-3.5 w-3.5" />
                                        <span>{docsCount} documents</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Banknote className="h-3.5 w-3.5" />
                                        <span>{req.status === "completed" ? "Paid" : formatCurrency(req.price_snapshot)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>Created {formatDate(req.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-border p-3">
                                <Link
                                    href={`/dashboard/kiosk/request/${req.id}`}
                                    className="flex items-center justify-center w-full text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                                >
                                    View Details <ChevronRight className="h-4 w-4 ml-1" />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredRequests.length === 0 && (
                <div className="text-center py-12 border border-dashed rounded-xl border-border">
                    <p className="text-muted-foreground">No requests found for the selected status.</p>
                </div>
            )}
        </div>
    );
}
