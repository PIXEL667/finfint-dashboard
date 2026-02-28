"use client";

import { useState } from "react";
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    Download,
    Search,
    IndianRupee,
    Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

/* ── Inline mock data ── */

const mockWalletBalance = 8450.50;

const mockWalletTransactions = [
    { id: "wt1", type: "credit" as const, description: "Commission — PAN Card (John Doe)", category: "commission", amount: 75, payment_method: "Wallet", reference: "SR001", status: "completed", created_at: "2026-02-25T14:30:00Z" },
    { id: "wt2", type: "debit" as const, description: "Withdrawal to HDFC Bank", category: "withdrawal", amount: 2000, payment_method: "Bank Transfer", reference: "WD-1001", status: "completed", created_at: "2026-02-20T10:00:00Z" },
    { id: "wt3", type: "credit" as const, description: "Commission — Income Tax Filing (Rahul Sharma)", category: "commission", amount: 179.82, payment_method: "Wallet", reference: "SR002", status: "completed", created_at: "2026-02-18T16:00:00Z" },
    { id: "wt4", type: "credit" as const, description: "Commission — Driving License (Sneha Gupta)", category: "commission", amount: 72, payment_method: "Wallet", reference: "SR004", status: "completed", created_at: "2026-02-15T11:00:00Z" },
    { id: "wt5", type: "debit" as const, description: "Withdrawal to SBI", category: "withdrawal", amount: 3000, payment_method: "Bank Transfer", reference: "WD-1002", status: "completed", created_at: "2026-02-10T09:00:00Z" },
    { id: "wt6", type: "credit" as const, description: "Commission — GST Registration (Vikram Singh)", category: "commission", amount: 300, payment_method: "Wallet", reference: "SR005", status: "pending", created_at: "2026-02-08T13:00:00Z" },
];

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(amount);
}

function formatDateTime(dateStr: string) {
    return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", hour: '2-digit', minute: '2-digit' }).format(new Date(dateStr));
}

export default function AgentWalletPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

    // Form States
    const [amount, setAmount] = useState("");
    const [bankAccount, setBankAccount] = useState("");

    const filteredTransactions = mockWalletTransactions.filter((tx) =>
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleWithdraw = () => {
        if (!amount || !bankAccount) {
            toast.error("Please fill all fields");
            return;
        }
        if (Number(amount) > mockWalletBalance) {
            toast.error("Insufficient balance");
            return;
        }
        toast.success(`Withdrawal request of ${formatCurrency(Number(amount))} has been initiated.`);
        setIsWithdrawOpen(false);
        setAmount("");
        setBankAccount("");
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header section with title */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Wallet className="h-8 w-8 text-emerald-600" />
                        My Wallet & Commissions
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        View your earned commissions and request withdrawals to your bank account.
                    </p>
                </div>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-emerald-600 text-white rounded-xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl" />

                    <div className="relative z-10">
                        <p className="text-white/80 font-medium mb-1">Available for Withdrawal</p>
                        <div className="flex items-end gap-2">
                            <h2 className="text-5xl font-bold tracking-tight">
                                {formatCurrency(mockWalletBalance)}
                            </h2>
                        </div>
                        <p className="text-white/60 text-xs mt-2 max-w-sm">
                            Commissions for completed services are instantly credited and available to withdraw.
                        </p>
                    </div>

                    <div className="flex gap-4 mt-8 relative z-10">
                        <Button
                            variant="secondary"
                            className="bg-white text-emerald-700 hover:bg-white/90 font-semibold"
                            onClick={() => setIsWithdrawOpen(true)}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Claim / Withdraw Commission
                        </Button>
                    </div>
                </div>

                <div className="bg-card rounded-xl p-6 border border-border flex flex-col justify-center space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-600">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <ArrowDownLeft className="h-5 w-5" />
                            </div>
                            <span className="font-medium text-sm">Total Earned</span>
                        </div>
                        <span className="font-bold">{formatCurrency(18500.50)}</span>
                    </div>
                    <div className="w-full h-px bg-border" />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-rose-600">
                            <div className="p-2 bg-rose-100 rounded-lg">
                                <ArrowUpRight className="h-5 w-5" />
                            </div>
                            <span className="font-medium text-sm">Total Withdrawn</span>
                        </div>
                        <span className="font-bold">{formatCurrency(10050.00)}</span>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between pt-4 gap-4 items-center">
                    <h2 className="text-xl font-semibold">Wallet History</h2>
                    <div className="relative w-full sm:w-auto min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search history, commissions, withdrawals..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-card"
                        />
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead className="w-[150px]">Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        No transactions found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredTransactions.map((tx) => (
                                    <TableRow key={tx.id} className="hover:bg-muted/50">
                                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                            {formatDateTime(tx.created_at)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{tx.description}</div>
                                            {tx.payment_method && <div className="text-xs text-muted-foreground mt-0.5">via {tx.payment_method}</div>}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            <Badge variant="outline" className={`capitalize ${tx.category === 'withdrawal' ? 'border-rose-200 text-rose-700 bg-rose-50' : 'border-emerald-200 text-emerald-700 bg-emerald-50'}`}>
                                                {tx.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm font-mono text-muted-foreground">
                                            {tx.reference || "-"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                tx.status === "completed" ? "default" :
                                                    tx.status === "pending" ? "secondary" : "destructive"
                                            } className={
                                                tx.status === "completed" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" :
                                                    tx.status === "pending" ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : ""
                                            }>
                                                {tx.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className={`text-right font-semibold whitespace-nowrap ${tx.type === "credit" ? "text-emerald-600" : "text-foreground"
                                            }`}>
                                            {tx.type === "credit" ? "+" : "-"}{formatCurrency(tx.amount)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Withdraw Modal */}
            <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Claim Commission</DialogTitle>
                        <DialogDescription>
                            Withdraw your earned commissions directly to your linked bank account.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="rounded-md bg-emerald-50 border border-emerald-100 p-3 text-sm flex justify-between items-center">
                            <span className="text-emerald-700 font-medium">Available to withdraw:</span>
                            <span className="font-bold text-emerald-700 text-lg">{formatCurrency(mockWalletBalance)}</span>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bank">Bank Account</Label>
                            <Select value={bankAccount} onValueChange={setBankAccount}>
                                <SelectTrigger id="bank">
                                    <SelectValue placeholder="Select a bank account" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hdfc">HDFC Bank (•••• 4521)</SelectItem>
                                    <SelectItem value="sbi">State Bank of India (•••• 8820)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="withdraw-amount">Amount to withdraw (INR)</Label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="withdraw-amount"
                                    type="number"
                                    placeholder="0.00"
                                    className="pl-9"
                                    value={amount}
                                    max={mockWalletBalance}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsWithdrawOpen(false)}>Cancel</Button>
                        <Button onClick={handleWithdraw} className="bg-emerald-600 hover:bg-emerald-700 text-white">Confirm Withdrawal</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
