"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Filter,
    Plus,
    FileText,
    Calendar,
    ChevronRight,
    IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── Inline mock data ── */

const mockRequests = [
    { id: "sr001", service_name: "PAN Card Application", client_name: "John Doe", status: "pending_admin_approval", amount: 590, commission: 75, created_at: "2026-02-10" },
    { id: "sr002", service_name: "Income Tax Filing", client_name: "Rahul Sharma", status: "completed", amount: 1178.82, commission: 179.82, created_at: "2026-01-05" },
    { id: "sr003", service_name: "Passport Application", client_name: "Amit Patel", status: "approved", amount: 1770, commission: 150, created_at: "2026-02-20" },
    { id: "sr004", service_name: "Driving License Renewal", client_name: "Sneha Gupta", status: "completed", amount: 708, commission: 72, created_at: "2025-12-12" },
    { id: "sr005", service_name: "GST Registration", client_name: "Vikram Singh", status: "pending_admin_approval", amount: 2360, commission: 300, created_at: "2026-02-15" },
];

function formatCurrency(n: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);
}

const statusFilters = [
    { id: "all", label: "All" },
    { id: "pending_admin_approval", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "completed", label: "Completed" },
];

/* ── Component ── */

export default function KioskRequestsPage() {
    const [activeFilter, setActiveFilter] = useState("all");

    const filtered = activeFilter === "all" ? mockRequests : mockRequests.filter(r => r.status === activeFilter);

    const getStatusBadge = (status: string) => {
        const map: Record<string, { class: string; label: string }> = {
            pending_admin_approval: { class: "bg-amber-100 text-amber-700", label: "Pending" },
            approved: { class: "bg-blue-100 text-blue-700", label: "Approved" },
            in_progress: { class: "bg-violet-100 text-violet-700", label: "In Progress" },
            completed: { class: "bg-emerald-100 text-emerald-700", label: "Completed" },
        };
        const s = map[status] || { class: "bg-muted text-muted-foreground", label: status };
        return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${s.class}`}>{s.label}</span>;
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <FileText className="h-6 w-6 text-emerald-600" /> Service Requests
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">Track all requests made on behalf of your clients.</p>
                </div>
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Link href="/dashboard/kiosk/request/new"><Plus className="mr-2 h-4 w-4" /> New Request</Link>
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                {statusFilters.map(f => (
                    <button key={f.id} onClick={() => setActiveFilter(f.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeFilter === f.id ? "bg-emerald-600 text-white" : "bg-background text-foreground border border-border hover:bg-muted"}`}>
                        {f.label}
                    </button>
                ))}
                <span className="ml-auto text-sm text-muted-foreground">{filtered.length} results</span>
            </div>

            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="bg-card rounded-xl border border-border p-12 text-center text-muted-foreground">
                        <FileText className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                        <p>No requests found.</p>
                    </div>
                ) : (
                    filtered.map(req => (
                        <Link key={req.id} href={`/dashboard/kiosk/request/${req.id}`}
                            className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex items-center justify-between gap-4 group">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                                    <FileText className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-sm">{req.service_name}</p>
                                    <p className="text-xs text-muted-foreground">{req.id.toUpperCase()} • Client: {req.client_name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 shrink-0">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold">{formatCurrency(req.amount)}</p>
                                    <p className="text-xs text-emerald-600 flex items-center gap-1 justify-end">
                                        <IndianRupee className="h-3 w-3" /> +{formatCurrency(req.commission)}
                                    </p>
                                </div>
                                {getStatusBadge(req.status)}
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
