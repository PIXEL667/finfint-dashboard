"use client";

import { useState } from "react";
import {
    IndianRupee,
    ArrowUpRight,
    ArrowDownLeft,
    Users,
    TrendingUp,
    CheckCircle,
    Search,
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

interface Transaction {
    id: string;
    type: "money_in" | "money_out";
    description: string;
    agent_name: string;
    amount: number;
    date: string;
    status: string;
}

const totalMoneyIn = 128_500;
const totalMoneyOut = 24_300;
const initialCashToCollect = 19_275;
const totalCashCollected = 45_000;

const initialKioskCash = [
    { id: "k1", name: "Priya Sharma", kiosk: "Downtown Kiosk", to_collect: 7500, collected: 28_000 },
    { id: "k2", name: "Rahul Verma", kiosk: "Park Street Kiosk", to_collect: 5200, collected: 18_500 },
    { id: "k3", name: "Neha Gupta", kiosk: "Mall Road Kiosk", to_collect: 3800, collected: 12_000 },
    { id: "k4", name: "Amit Patel", kiosk: "Station Road Kiosk", to_collect: 2775, collected: 9_500 },
];

const initialTransactions: Transaction[] = [
    { id: "t1", type: "money_in", description: "PAN Card — John Doe (completed)", agent_name: "Priya Sharma", amount: 590, date: "2026-02-25T14:00:00Z", status: "completed" },
    { id: "t2", type: "money_in", description: "Cash Collected from Agent", agent_name: "Priya Sharma", amount: 4200, date: "2026-02-20T10:00:00Z", status: "completed" },
    { id: "t3", type: "money_in", description: "Income Tax Filing — Rahul Sharma (completed)", agent_name: "Rahul Verma", amount: 1178.82, date: "2026-02-18T16:00:00Z", status: "completed" },
    { id: "t4", type: "money_in", description: "Driving License — Sneha Gupta (completed)", agent_name: "Neha Gupta", amount: 708, date: "2026-02-15T11:00:00Z", status: "completed" },
    { id: "t5", type: "money_in", description: "Cash Collected from Agent", agent_name: "Rahul Verma", amount: 3200, date: "2026-02-10T09:00:00Z", status: "completed" },
    { id: "t6", type: "money_out", description: "Refund — Cancelled Request", agent_name: "Priya Sharma", amount: 2360, date: "2026-02-08T13:00:00Z", status: "completed" },
];

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(amount);
}

function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(dateStr));
}

/* ── Component ── */

export default function AdminPaymentHistoryPage() {
    const [transactions, setTransactions] = useState(initialTransactions);
    const [kioskCash, setKioskCash] = useState(initialKioskCash);
    const [searchQuery, setSearchQuery] = useState("");
    const [collectDialog, setCollectDialog] = useState<typeof initialKioskCash[0] | null>(null);
    const [cashToCollect, setCashToCollect] = useState(initialCashToCollect);

    const filteredTx = transactions.filter(t =>
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.agent_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCollectCash = (id: string) => {
        const kiosk = kioskCash.find(k => k.id === id);
        if (!kiosk || kiosk.to_collect === 0) return;

        // Update Kiosk Cash Stats
        const collectedAmount = kiosk.to_collect;
        setKioskCash(prev => prev.map(k => k.id === id ? { ...k, to_collect: 0, collected: k.collected + collectedAmount } : k));

        // Update Global Stats
        setCashToCollect(prev => prev - collectedAmount);

        // Add to transactions
        const newTx: Transaction = {
            id: `tc_${Date.now()}`,
            type: "money_in",
            description: "Cash Collected from Agent",
            agent_name: kiosk.name,
            amount: collectedAmount,
            date: new Date().toISOString(),
            status: "completed"
        };
        setTransactions(prev => [newTx, ...prev]);

        toast.success(`₹${collectedAmount.toLocaleString("en-IN")} collected from ${kiosk.name}!`);
        setCollectDialog(null);
    };

    const stats = [
        { label: "Total Money In", value: formatCurrency(totalMoneyIn), icon: TrendingUp, color: "text-emerald-600", borderColor: "border-l-emerald-500", bg: "bg-emerald-50" },
        { label: "Total Money Out", value: formatCurrency(totalMoneyOut), icon: ArrowDownLeft, color: "text-red-500", borderColor: "border-l-red-400", bg: "bg-red-50" },
        { label: "Cash to Collect", value: formatCurrency(cashToCollect), icon: Users, color: "text-amber-600", borderColor: "border-l-amber-500", bg: "bg-amber-50" },
        { label: "Cash Collected", value: formatCurrency(totalCashCollected), icon: CheckCircle, color: "text-sky-600", borderColor: "border-l-sky-500", bg: "bg-sky-50" },
    ];

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <IndianRupee className="h-8 w-8 text-violet-600" />
                        Payment History
                    </h1>
                    <p className="text-muted-foreground mt-1">Track money in, money out, and manage cash collection from agents.</p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.label} className={`bg-card rounded-xl p-5 shadow-sm border border-border border-l-4 ${stat.borderColor} relative overflow-hidden`}>
                        <div className={`p-2 rounded-lg ${stat.bg} w-fit mb-3`}>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                        <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Kiosk Cash Collection Table */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Users className="h-5 w-5 text-violet-600" />
                    Agent Cash Collection
                </h2>
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead>Agent / Kiosk</TableHead>
                                <TableHead className="text-right">Total Collected</TableHead>
                                <TableHead className="text-right">Cash to Collect</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {kioskCash.map(k => (
                                <TableRow key={k.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                        <p className="font-medium">{k.name}</p>
                                        <p className="text-xs text-muted-foreground">{k.kiosk}</p>
                                    </TableCell>
                                    <TableCell className="text-right text-sm">{formatCurrency(k.collected)}</TableCell>
                                    <TableCell className="text-right">
                                        <span className={`font-semibold ${k.to_collect > 0 ? "text-amber-600" : "text-muted-foreground"}`}>
                                            {formatCurrency(k.to_collect)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={k.to_collect === 0}
                                            onClick={() => setCollectDialog(k)}
                                            className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                        >
                                            <CheckCircle className="mr-1 h-3 w-3" /> Mark Collected
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Transaction History */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-violet-600" />
                        All Transactions
                    </h2>
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search transactions..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 bg-card" />
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="hidden sm:table-cell">Agent</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-right hidden md:table-cell">Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTx.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No transactions found.</TableCell>
                                </TableRow>
                            ) : (
                                filteredTx.map(tx => (
                                    <TableRow key={tx.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell>
                                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${tx.type === "money_in" ? "bg-emerald-100" : "bg-red-100"}`}>
                                                {tx.type === "money_in" ? <ArrowDownLeft className="h-4 w-4 text-emerald-600" /> : <ArrowUpRight className="h-4 w-4 text-red-500" />}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">{tx.description}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">{tx.agent_name}</TableCell>
                                        <TableCell className={`text-right font-semibold text-sm ${tx.type === "money_in" ? "text-emerald-600" : "text-red-500"}`}>
                                            {tx.type === "money_in" ? "+" : "-"}{formatCurrency(tx.amount)}
                                        </TableCell>
                                        <TableCell className="text-right text-sm text-muted-foreground hidden md:table-cell">{formatDate(tx.date)}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={tx.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                                                {tx.status === "completed" ? "Completed" : "Pending"}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Collect Cash Dialog */}
            <Dialog open={!!collectDialog} onOpenChange={open => { if (!open) setCollectDialog(null); }}>
                <DialogContent className="sm:max-w-md">
                    {collectDialog && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Confirm Cash Collection</DialogTitle>
                                <DialogDescription>Mark cash as collected from {collectDialog.name}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="bg-muted/30 rounded-lg p-4 border border-border space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Agent</span>
                                        <span className="font-medium">{collectDialog.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Kiosk</span>
                                        <span>{collectDialog.kiosk}</span>
                                    </div>
                                    <div className="border-t border-border pt-2 flex justify-between font-bold">
                                        <span>Cash to Collect</span>
                                        <span className="text-emerald-600">{formatCurrency(collectDialog.to_collect)}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground text-center">
                                    By confirming, you verify that you have received this amount in cash from the agent.
                                </p>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setCollectDialog(null)}>Cancel</Button>
                                <Button onClick={() => handleCollectCash(collectDialog.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                    <CheckCircle className="mr-2 h-4 w-4" /> Confirm Collection
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
