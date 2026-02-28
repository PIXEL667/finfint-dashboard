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
    module: "Users" | "Requests" | "Wallet" | "Services" | "System";
    userName: string;
    userRole: string;
    status: "success" | "warning" | "error" | "info";
    details: string;
}

const mockLogs: LogEntry[] = [
    { id: "log_001", timestamp: "2026-02-28T10:15:00Z", action: "User Created", module: "Users", userName: "Aryan Admin", userRole: "Admin", status: "success", details: "Created new Kiosk Agent: Priya Sharma" },
    { id: "log_002", timestamp: "2026-02-28T09:45:00Z", action: "Commission Collected", module: "Wallet", userName: "Aryan Admin", userRole: "Admin", status: "success", details: "Collected ₹7,500 from Downtown Kiosk" },
    { id: "log_003", timestamp: "2026-02-28T09:20:00Z", action: "Service Request Status Changed", module: "Requests", userName: "Priya Sharma", userRole: "Kiosk Agent", status: "info", details: "Updated request sr005 to 'In Progress'" },
    { id: "log_004", timestamp: "2026-02-27T16:30:00Z", action: "Failed Authentication", module: "System", userName: "Unknown", userRole: "Guest", status: "error", details: "3 failed login attempts for admin@finfint.com" },
    { id: "log_005", timestamp: "2026-02-27T14:10:00Z", action: "Service Updated", module: "Services", userName: "Aryan Admin", userRole: "Admin", status: "info", details: "Updated price for 'Income Tax Filing' from ₹1000 to ₹1178.82" },
    { id: "log_006", timestamp: "2026-02-27T11:05:00Z", action: "New Request Submitted", module: "Requests", userName: "John Doe", userRole: "Client", status: "success", details: "Submitted 'PAN Card Application'" },
    { id: "log_007", timestamp: "2026-02-26T15:22:00Z", action: "User Blocked", module: "Users", userName: "Aryan Admin", userRole: "Admin", status: "warning", details: "Blocked user u003 due to policy violation" },
];

function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric", month: "short", year: "numeric",
        hour: "numeric", minute: "numeric", hour12: true
    }).format(new Date(dateStr));
}

/* ── Component ── */

export default function AdminLogsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [moduleFilter, setModuleFilter] = useState("All");

    const modules = ["All", "Users", "Requests", "Wallet", "Services", "System"];

    const filteredLogs = mockLogs.filter(log => {
        const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.details.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesModule = moduleFilter === "All" || log.module === moduleFilter;
        return matchesSearch && matchesModule;
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
                    <History className="h-8 w-8 text-violet-600" />
                    System Activity Logs
                </h1>
                <p className="text-muted-foreground mt-1">
                    Track system-wide events, user actions, and security alerts.
                </p>
            </div>

            {/* Filters */}
            <div className="bg-card rounded-xl border border-border p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search logs by action, user, or details..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 bg-background" />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
                    <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                    {modules.map(mod => (
                        <button
                            key={mod}
                            onClick={() => setModuleFilter(mod)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${moduleFilter === mod
                                ? "bg-violet-600 text-white"
                                : "bg-background text-foreground border border-border hover:bg-muted"
                                }`}
                        >
                            {mod}
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
                            <TableHead>User</TableHead>
                            <TableHead>Module</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead className="w-[30%]">Details</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLogs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No logs found matching your criteria.</TableCell>
                            </TableRow>
                        ) : (
                            filteredLogs.map(log => (
                                <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                        {formatDate(log.timestamp)}
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-medium text-sm">{log.userName}</p>
                                        <p className="text-xs text-muted-foreground">{log.userRole}</p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-muted">
                                            {log.module}
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
