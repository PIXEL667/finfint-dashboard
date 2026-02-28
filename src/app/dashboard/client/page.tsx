import Link from "next/link";
import {
    Plus,
    FileText,
    Banknote,
    Calendar,
    ChevronRight,
    TrendingUp,
    Clock,
    CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── Inline mock data ── */

const mockServices = [
    { id: "s1", name: "PAN Card Application", category_name: "Identity", description: "Apply for a new PAN card or reprint.", base_price: 500, tax_percent: 18 },
    { id: "s2", name: "Aadhaar Update", category_name: "Identity", description: "Update address, phone, or name on Aadhaar.", base_price: 200, tax_percent: 18 },
    { id: "s3", name: "Passport Application", category_name: "Travel", description: "Apply for a new passport or renewal.", base_price: 1500, tax_percent: 18 },
    { id: "s4", name: "Income Tax Filing", category_name: "Tax", description: "File your annual income tax returns.", base_price: 999, tax_percent: 18 },
];

const mockRequests = [
    { id: "sr001", service_name: "PAN Card Application", status: "pending_admin_approval", amount: 590, created_at: "2026-02-10" },
    { id: "sr002", service_name: "Income Tax Filing", status: "completed", amount: 1178.82, created_at: "2026-01-05" },
    { id: "sr003", service_name: "Passport Application", status: "approved", amount: 1770, created_at: "2026-02-20" },
];

function formatCurrency(n: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);
}

/* ── Component ── */

export default function ClientDashboardPage() {
    const pending = mockRequests.filter(r => r.status === "pending_admin_approval").length;
    const completed = mockRequests.filter(r => r.status === "completed").length;
    const totalSpent = mockRequests.filter(r => r.status === "completed").reduce((a, b) => a + b.amount, 0);

    const stats = [
        { label: "Total Requests", value: mockRequests.length, icon: FileText, color: "text-sky-600", borderColor: "border-l-sky-500", bg: "bg-sky-50" },
        { label: "Pending Approval", value: pending, icon: Clock, color: "text-amber-600", borderColor: "border-l-amber-500", bg: "bg-amber-50" },
        { label: "Completed", value: completed, icon: CheckCircle2, color: "text-emerald-600", borderColor: "border-l-emerald-500", bg: "bg-emerald-50" },
        { label: "Total Spent", value: formatCurrency(totalSpent), icon: Banknote, color: "text-violet-600", borderColor: "border-l-violet-500", bg: "bg-violet-50" },
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
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, John!</h1>
                    <p className="text-muted-foreground mt-1">Here&apos;s an overview of your service requests.</p>
                </div>
                <Button asChild className="bg-sky-600 hover:bg-sky-700 text-white">
                    <Link href="/dashboard/client/request/new">
                        <Plus className="mr-2 h-4 w-4" /> New Request
                    </Link>
                </Button>
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
                        <TrendingUp className="h-5 w-5 text-sky-600" /> Recent Requests
                    </h2>
                    <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                        <Link href="/dashboard/client/request">View All <ChevronRight className="h-4 w-4 ml-1" /></Link>
                    </Button>
                </div>

                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-muted/30">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Service</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {mockRequests.map(req => (
                                <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-sm">{req.service_name}</p>
                                        <p className="text-xs text-muted-foreground">{req.id.toUpperCase()}</p>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5" />{req.created_at}
                                    </td>
                                    <td className="px-4 py-3">{getStatusBadge(req.status)}</td>
                                    <td className="px-4 py-3 text-right text-sm font-semibold">{formatCurrency(req.amount)}</td>
                                    <td className="px-4 py-3 text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/dashboard/client/request/${req.id}`}>
                                                <ChevronRight className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Available Services */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold">Available Services</h2>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {mockServices.map(s => (
                        <div key={s.id} className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md hover:border-sky-200 transition-all group">
                            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded mb-3">
                                {s.category_name}
                            </span>
                            <h3 className="font-bold mb-1">{s.name}</h3>
                            <p className="text-xs text-muted-foreground mb-3">{s.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-sky-600">{formatCurrency(s.base_price)}</span>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/dashboard/client/request/new">Apply →</Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
