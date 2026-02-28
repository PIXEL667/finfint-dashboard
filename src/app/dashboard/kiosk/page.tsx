import Link from "next/link";
import {
    Plus,
    FileText,
    Banknote,
    Calendar,
    ChevronRight,
    TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── Inline mock data ── */

const mockServices = [
    { id: "s1", name: "PAN Card Application", category_name: "Identity", description: "Apply for a new PAN card or reprint. Required for income tax filings and financial transactions.", base_price: 500, tax_percent: 18 },
    { id: "s2", name: "Aadhaar Update", category_name: "Identity", description: "Update address, mobile number, or biometrics on your Aadhaar card.", base_price: 200, tax_percent: 18 },
    { id: "s3", name: "Passport Application", category_name: "Travel", description: "New passport application or passport renewal with document verification.", base_price: 1500, tax_percent: 18 },
    { id: "s4", name: "Income Tax Filing", category_name: "Tax", description: "E-filing of personal or business income tax returns for the financial year.", base_price: 999, tax_percent: 18 },
    { id: "s5", name: "GST Registration", category_name: "Tax", description: "Register your business for Goods and Services Tax compliance.", base_price: 2000, tax_percent: 18 },
    { id: "s6", name: "Driving License Renewal", category_name: "Transport", description: "Renew your driving license before or after expiry date through our kiosk.", base_price: 600, tax_percent: 18 },
];

const mockServiceRequests = [
    { id: "sr001", service_id: "s1", service_name: "PAN Card Application", customer_id: "u3", customer_name: "John Doe", agent_id: "u2", agent_name: "Priya Sharma", kiosk_id: "k1", kiosk_name: "Downtown Kiosk", status: "in_progress", price_snapshot: 500, tax_snapshot: 90, total_amount_snapshot: 590, created_at: "2026-02-10T09:30:00Z", updated_at: "2026-02-18T14:00:00Z" },
    { id: "sr002", service_id: "s4", service_name: "Income Tax Filing", customer_id: "u3", customer_name: "John Doe", agent_id: "u4", agent_name: "Rahul Verma", kiosk_id: "k2", kiosk_name: "Park Street Kiosk", status: "completed", price_snapshot: 999, tax_snapshot: 179.82, total_amount_snapshot: 1178.82, created_at: "2026-01-05T11:00:00Z", updated_at: "2026-01-25T16:00:00Z" },
    { id: "sr003", service_id: "s3", service_name: "Passport Application", customer_id: "u3", customer_name: "John Doe", agent_id: "u2", agent_name: "Priya Sharma", kiosk_id: "k1", kiosk_name: "Downtown Kiosk", status: "pending", price_snapshot: 1500, tax_snapshot: 270, total_amount_snapshot: 1770, created_at: "2026-02-20T08:00:00Z", updated_at: "2026-02-20T08:00:00Z" },
    { id: "sr004", service_id: "s6", service_name: "Driving License Renewal", customer_id: "u3", customer_name: "John Doe", agent_id: "u5", agent_name: "Neha Gupta", kiosk_id: "k3", kiosk_name: "Mall Road Kiosk", status: "completed", price_snapshot: 600, tax_snapshot: 108, total_amount_snapshot: 708, created_at: "2025-12-12T10:30:00Z", updated_at: "2025-12-28T11:00:00Z" },
    { id: "sr005", service_id: "s5", service_name: "GST Registration", customer_id: "u3", customer_name: "John Doe", agent_id: "u2", agent_name: "Priya Sharma", kiosk_id: "k1", kiosk_name: "Downtown Kiosk", status: "in_progress", price_snapshot: 2000, tax_snapshot: 360, total_amount_snapshot: 2360, created_at: "2026-02-15T13:00:00Z", updated_at: "2026-02-22T09:00:00Z" },
];

const mockDocuments = [
    { id: "d1", service_request_id: "sr001", document_name: "ID Proof" },
    { id: "d2", service_request_id: "sr001", document_name: "Address Proof" },
    { id: "d3", service_request_id: "sr002", document_name: "Form 16" },
    { id: "d4", service_request_id: "sr002", document_name: "Bank Statement" },
    { id: "d5", service_request_id: "sr005", document_name: "Business PAN" },
];

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(amount);
}

function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(dateStr));
}

/* ── Component ── */

export default function DashboardPage() {
    const activeRequests = mockServiceRequests.filter(
        (r) => r.status === "in_progress" || r.status === "pending"
    );
    const completedRequests = mockServiceRequests.filter(
        (r) => r.status === "completed"
    );

    // Simulate pending payments amount
    const pendingAmount = activeRequests.reduce((sum, req) => sum + req.price_snapshot, 0);

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Welcome, John Doe
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your service requests and documents from here
                    </p>
                </div>
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[140px]">
                    <Link href="/dashboard/kiosk/request/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Request
                    </Link>
                </Button>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border border-l-4 border-l-primary relative overflow-hidden">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Active Requests</p>
                        <p className="text-4xl font-bold text-primary">{activeRequests.length}</p>
                        <p className="text-sm text-muted-foreground">{activeRequests.length} requests in progress</p>
                    </div>
                </div>

                <div className="bg-card rounded-xl p-6 shadow-sm border border-border border-l-4 border-l-accent relative overflow-hidden">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Completed</p>
                        <p className="text-4xl font-bold text-accent">{completedRequests.length}</p>
                        <p className="text-sm text-muted-foreground">{completedRequests.length} completed requests</p>
                    </div>
                </div>

                <div className="bg-card rounded-xl p-6 shadow-sm border border-border border-l-4 border-l-yellow-500 relative overflow-hidden">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Pending Payments</p>
                        <p className="text-4xl font-bold text-yellow-500">{formatCurrency(pendingAmount)}</p>
                        <p className="text-sm text-muted-foreground">Amount due</p>
                    </div>
                </div>
            </div>

            {/* Your Requests Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold">Your Requests</h2>
                </div>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    {mockServiceRequests.slice(0, 4).map((req) => {
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
            </div>
        </div>
    );
}
