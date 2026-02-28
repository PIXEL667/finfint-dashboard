"use client";

import { useState } from "react";
import { History, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

/* ── Inline mock data ── */

interface LogEntry {
    id: string;
    timestamp: string;
    action: string;
    category: "Clients" | "Requests" | "Wallet" | "Profile" | "System";
    status: "success" | "warning" | "error" | "info";
    details: string;
}

const mockLogs: LogEntry[] = [
    { id: "log_k001", timestamp: "2026-02-28T10:15:00Z", action: "Client Added", category: "Clients", status: "success", details: "Added new client 'Rahul Sharma' to your database" },
    { id: "log_k002", timestamp: "2026-02-28T09:45:00Z", action: "Commission Received", category: "Wallet", status: "success", details: "Received commission payout of ₹4,200 for Feb" },
    { id: "log_k003", timestamp: "2026-02-28T09:20:00Z", action: "Request Submitted", category: "Requests", status: "success", details: "Submitted 'GST Registration' for Vikram Singh" },
    { id: "log_k004", timestamp: "2026-02-27T16:30:00Z", action: "Document Uploaded", category: "Requests", status: "info", details: "Uploaded Aadhar Card for sr012" },
    { id: "log_k005", timestamp: "2026-02-27T14:10:00Z", action: "Request Rejected", category: "Requests", status: "error", details: "Admin rejected sr010 due to missing documents" },
    { id: "log_k006", timestamp: "2026-02-27T11:05:00Z", action: "Login Success", category: "System", status: "info", details: "Logged in from IP 192.168.1.14" },
    { id: "log_k007", timestamp: "2026-02-26T15:22:00Z", action: "Profile Updated", category: "Profile", status: "success", details: "Updated email address successfully" },
];

function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric", month: "short", year: "numeric",
        hour: "numeric", minute: "numeric", hour12: true
    }).format(new Date(dateStr));
}

/* ── Component ── */

export default function KioskLogsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");

    const categories = ["All", "Clients", "Requests", "Wallet", "Profile", "System"];

    const filteredLogs = mockLogs.filter(log => {
        const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.details.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "All" || log.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "success": return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Success</Badge>;
            case "warning": return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Warning</Badge>;
            case "error": return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Error</Badge>;
            case "info":
            default: return <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200">Info</Badge>;
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <History className="h-8 w-8 text-emerald-600" />
                    Activity Logs
                </h1>
                <p className="text-muted-foreground mt-1">
                    Track your actions, client activities, and service request timelines.
                </p>
            </div>

            {/* Filters */}
            <div className="bg-card rounded-xl border border-border p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search logs by action or details..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 bg-background" />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
                    <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${categoryFilter === cat
                                ? "bg-emerald-600 text-white"
                                : "bg-background text-foreground border border-border hover:bg-muted"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead className="w-[40%]">Details</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLogs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">No logs found matching your criteria.</TableCell>
                            </TableRow>
                        ) : (
                            filteredLogs.map(log => (
                                <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                        {formatDate(log.timestamp)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-muted text-foreground">
                                            {log.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium text-sm">
                                        {log.action}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {log.details}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(log.status)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
