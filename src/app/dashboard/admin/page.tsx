import Link from "next/link";
import {
    PackageOpen,
    FileText,
    Wallet,
    TrendingUp,
    Users,
    IndianRupee,
    Clock,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── Inline mock data ── */

const mockServices = [
    { id: "s1", name: "PAN Card Application", category: "Identity", price: 500, commission_rate: 15 },
    { id: "s2", name: "Aadhaar Update", category: "Identity", price: 200, commission_rate: 12 },
    { id: "s3", name: "Passport Application", category: "Travel", price: 1500, commission_rate: 10 },
    { id: "s4", name: "Income Tax Filing", category: "Tax", price: 999, commission_rate: 18 },
    { id: "s5", name: "GST Registration", category: "Tax", price: 2000, commission_rate: 15 },
    { id: "s6", name: "Driving License Renewal", category: "Transport", price: 600, commission_rate: 12 },
];

const mockRequests = [
    { id: "sr001", service_name: "PAN Card Application", customer_name: "John Doe", agent_name: "Priya Sharma", status: "pending_admin_approval", amount: 590, created_at: "2026-02-10T09:30:00Z" },
    { id: "sr002", service_name: "Income Tax Filing", customer_name: "Rahul Sharma", agent_name: "Rahul Verma", status: "completed", amount: 1178.82, created_at: "2026-01-05T11:00:00Z" },
    { id: "sr003", service_name: "Passport Application", customer_name: "Amit Patel", agent_name: "Priya Sharma", status: "pending_admin_approval", amount: 1770, created_at: "2026-02-20T08:00:00Z" },
    { id: "sr004", service_name: "Driving License Renewal", customer_name: "Sneha Gupta", agent_name: "Neha Gupta", status: "completed", amount: 708, created_at: "2025-12-12T10:30:00Z" },
    { id: "sr005", service_name: "GST Registration", customer_name: "Vikram Singh", agent_name: "Priya Sharma", status: "in_progress", amount: 2360, created_at: "2026-02-15T13:00:00Z" },
    { id: "sr006", service_name: "Aadhaar Update", customer_name: "Sneha Gupta", agent_name: "Priya Sharma", status: "approved", amount: 236, created_at: "2026-02-27T10:00:00Z" },
];

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(amount);
}

function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(dateStr));
}

/* ── Component ── */

export default function AdminDashboardPage() {
    const pendingRequests = mockRequests.filter(r => r.status === "pending_admin_approval");
    const completedRequests = mockRequests.filter(r => r.status === "completed");
    const totalRevenue = completedRequests.reduce((sum, r) => sum + r.amount, 0);
    const commissionPayable = totalRevenue * 0.15;

    const stats = [
        { label: "Total Services", value: mockServices.length, icon: PackageOpen, color: "text-violet-600", borderColor: "border-l-violet-500", bg: "bg-violet-50" },
        { label: "Pending Approval", value: pendingRequests.length, icon: Clock, color: "text-amber-600", borderColor: "border-l-amber-500", bg: "bg-amber-50" },
        { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: IndianRupee, color: "text-emerald-600", borderColor: "border-l-emerald-500", bg: "bg-emerald-50" },
        { label: "Commission Payable", value: formatCurrency(commissionPayable), icon: Wallet, color: "text-sky-600", borderColor: "border-l-sky-500", bg: "bg-sky-50" },
    ];

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Admin Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Overview of services, requests, and financial performance
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button asChild variant="outline">
                        <Link href="/dashboard/admin/requests">
                            <FileText className="mr-2 h-4 w-4" />
                            View Requests
                        </Link>
                    </Button>
                    <Button asChild className="bg-violet-600 hover:bg-violet-700 text-white">
                        <Link href="/dashboard/admin/services">
                            <PackageOpen className="mr-2 h-4 w-4" />
                            Manage Services
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.label} className={`bg-card rounded-xl p-5 shadow-sm border border-border border-l-4 ${stat.borderColor} relative overflow-hidden`}>
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Requests */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-violet-600" />
                        <h2 className="text-xl font-bold">Recent Service Requests</h2>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                        <Link href="/dashboard/admin/requests">
                            View All <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                    </Button>
                </div>

                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-muted/30">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Request</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Client</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Agent</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {mockRequests.slice(0, 5).map((req) => {
                                let badgeClass = "bg-muted text-muted-foreground";
                                let statusText = req.status;
                                if (req.status === "pending_admin_approval") { badgeClass = "bg-amber-100 text-amber-700"; statusText = "Pending"; }
                                if (req.status === "approved") { badgeClass = "bg-blue-100 text-blue-700"; statusText = "Approved"; }
                                if (req.status === "in_progress") { badgeClass = "bg-violet-100 text-violet-700"; statusText = "In Progress"; }
                                if (req.status === "completed") { badgeClass = "bg-emerald-100 text-emerald-700"; statusText = "Completed"; }

                                return (
                                    <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium text-sm">{req.service_name}</p>
                                                <p className="text-xs text-muted-foreground">{req.id.toUpperCase()} • {formatDate(req.created_at)}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{req.customer_name}</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{req.agent_name}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${badgeClass}`}>
                                                {statusText === "Completed" && <CheckCircle2 className="h-3 w-3" />}
                                                {statusText === "Pending" && <AlertCircle className="h-3 w-3" />}
                                                {statusText}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-semibold">{formatCurrency(req.amount)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <Link href="/dashboard/admin/services" className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md hover:border-violet-200 transition-all group">
                    <PackageOpen className="h-8 w-8 text-violet-600 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-lg mb-1">Manage Services</h3>
                    <p className="text-sm text-muted-foreground">Create, edit, and configure service offerings with documents and charges.</p>
                </Link>
                <Link href="/dashboard/admin/requests" className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md hover:border-amber-200 transition-all group">
                    <FileText className="h-8 w-8 text-amber-600 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-lg mb-1">Review Requests</h3>
                    <p className="text-sm text-muted-foreground">Approve or reject pending service requests from clients and kiosks.</p>
                </Link>
                <Link href="/dashboard/admin/wallet" className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group">
                    <Wallet className="h-8 w-8 text-emerald-600 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-lg mb-1">Commission & Wallet</h3>
                    <p className="text-sm text-muted-foreground">Track total earnings, manage commission payouts, and claim wallet balance.</p>
                </Link>
            </div>
        </div>
    );
}
