import Link from "next/link";
import {
    Plus,
    FileText,
    Banknote,
    Calendar,
    ChevronRight,
    TrendingUp,
    Users,
    Wallet,
    IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── Inline mock data ── */

const mockRequests = [
    { id: "sr001", service_name: "PAN Card Application", client_name: "John Doe", status: "pending_admin_approval", amount: 590, commission: 75, created_at: "2026-02-10" },
    { id: "sr002", service_name: "Income Tax Filing", client_name: "Rahul Sharma", status: "completed", amount: 1178.82, commission: 179.82, created_at: "2026-01-05" },
    { id: "sr003", service_name: "Passport Application", client_name: "Amit Patel", status: "approved", amount: 1770, commission: 150, created_at: "2026-02-20" },
    { id: "sr004", service_name: "Driving License Renewal", client_name: "Sneha Gupta", status: "completed", amount: 708, commission: 72, created_at: "2025-12-12" },
];

function formatCurrency(n: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);
}

/* ── Component ── */

export default function KioskDashboardPage() {
    const completed = mockRequests.filter(r => r.status === "completed");
    const pending = mockRequests.filter(r => r.status === "pending_admin_approval");
    const totalCommission = completed.reduce((a, b) => a + b.commission, 0);
    const walletBalance = 4_250;

    const stats = [
        { label: "Total Requests", value: mockRequests.length, icon: FileText, color: "text-emerald-600", borderColor: "border-l-emerald-500", bg: "bg-emerald-50" },
        { label: "Pending Approval", value: pending.length, icon: TrendingUp, color: "text-amber-600", borderColor: "border-l-amber-500", bg: "bg-amber-50" },
        { label: "Commission Earned", value: formatCurrency(totalCommission), icon: IndianRupee, color: "text-violet-600", borderColor: "border-l-violet-500", bg: "bg-violet-50" },
        { label: "Wallet Balance", value: formatCurrency(walletBalance), icon: Wallet, color: "text-sky-600", borderColor: "border-l-sky-500", bg: "bg-sky-50" },
    ];

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
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Agent Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage clients, requests, and track your commission earnings.</p>
                </div>
                <div className="flex gap-3">
                    <Button asChild variant="outline">
                        <Link href="/dashboard/kiosk/clients"><Users className="mr-2 h-4 w-4" /> My Clients</Link>
                    </Button>
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Link href="/dashboard/kiosk/request/new"><Plus className="mr-2 h-4 w-4" /> New Request</Link>
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map(s => (
                    <div key={s.label} className={`bg-card rounded-xl p-5 shadow-sm border border-border border-l-4 ${s.borderColor}`}>
                        <div className={`p-2 rounded-lg ${s.bg} w-fit mb-3`}>
                            <s.icon className={`h-5 w-5 ${s.color}`} />
                        </div>
                        <p className="text-2xl font-bold">{s.value}</p>
                        <p className="text-sm text-muted-foreground">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Requests */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-emerald-600" /> Recent Requests
                    </h2>
                    <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                        <Link href="/dashboard/kiosk/request">View All <ChevronRight className="h-4 w-4 ml-1" /></Link>
                    </Button>
                </div>

                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-muted/30">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Service</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Client</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Commission</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {mockRequests.map(req => (
                                <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-sm">{req.service_name}</p>
                                        <p className="text-xs text-muted-foreground">{req.id.toUpperCase()} • {req.created_at}</p>
                                    </td>
                                    <td className="px-4 py-3 text-sm">{req.client_name}</td>
                                    <td className="px-4 py-3">{getStatusBadge(req.status)}</td>
                                    <td className="px-4 py-3 text-right text-sm font-semibold">{formatCurrency(req.amount)}</td>
                                    <td className="px-4 py-3 text-right text-sm font-semibold text-emerald-600 hidden sm:table-cell">+{formatCurrency(req.commission)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <Link href="/dashboard/kiosk/clients" className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group">
                    <Users className="h-8 w-8 text-emerald-600 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-lg mb-1">Manage Clients</h3>
                    <p className="text-sm text-muted-foreground">Create new clients with OTP verification and manage existing ones.</p>
                </Link>
                <Link href="/dashboard/kiosk/request/new" className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md hover:border-sky-200 transition-all group">
                    <FileText className="h-8 w-8 text-sky-600 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-lg mb-1">New Request</h3>
                    <p className="text-sm text-muted-foreground">Create a service request on behalf of a client.</p>
                </Link>
                <Link href="/dashboard/kiosk/wallet" className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md hover:border-violet-200 transition-all group">
                    <Wallet className="h-8 w-8 text-violet-600 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-lg mb-1">Commission Wallet</h3>
                    <p className="text-sm text-muted-foreground">View your commission earnings and transaction history.</p>
                </Link>
            </div>
        </div>
    );
}
