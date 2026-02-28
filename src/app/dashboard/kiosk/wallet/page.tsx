"use client";

import { useState } from "react";
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    Download,
    Search,
    IndianRupee,
    Send
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

import { mockWalletBalance, mockWalletTransactions, formatCurrency, formatDateTime } from "../data";

export default function WalletPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSendMoneyOpen, setIsSendMoneyOpen] = useState(false);
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

    // Form States
    const [amount, setAmount] = useState("");
    const [recipient, setRecipient] = useState("");
    const [bankAccount, setBankAccount] = useState("");

    const filteredTransactions = mockWalletTransactions.filter((tx) =>
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSendMoney = () => {
        if (!amount || !recipient) {
            toast.error("Please fill all fields");
            return;
        }

        const feeAmount = Number(amount);
        const commission = feeAmount * 0.15;

        toast.success(`Platform fee of ${formatCurrency(feeAmount)} paid for Request ${recipient}.`);
        toast.success(`Earned ${formatCurrency(commission)} commission!`, {
            description: "Instant credit applied to your wallet balance."
        });

        setIsSendMoneyOpen(false);
        setAmount("");
        setRecipient("");
    };

    const handleWithdraw = () => {
        if (!amount || !bankAccount) {
            toast.error("Please fill all fields");
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
                        <Wallet className="h-8 w-8 text-primary" />
                        My Wallet
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your kiosk balance, transfer funds, or withdraw to your bank.
                    </p>
                </div>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-primary text-primary-foreground rounded-xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl" />

                    <div className="relative z-10">
                        <p className="text-primary-foreground/80 font-medium mb-1">Available Balance</p>
                        <div className="flex items-end gap-2">
                            <h2 className="text-5xl font-bold tracking-tight">
                                {formatCurrency(mockWalletBalance)}
                            </h2>
                        </div>
                        <p className="text-primary-foreground/60 text-xs mt-2 max-w-sm">
                            Commissions for completed services are instantly credited to this balance.
                        </p>
                    </div>

                    <div className="flex gap-4 mt-8 relative z-10">
                        <Button
                            variant="secondary"
                            className="bg-white text-primary hover:bg-white/90 font-semibold"
                            onClick={() => setIsSendMoneyOpen(true)}
                        >
                            <Send className="mr-2 h-4 w-4" />
                            Pay Service Fee
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-transparent border-white/30 text-white hover:bg-white/10"
                            onClick={() => setIsWithdrawOpen(true)}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Withdraw Funds
                        </Button>
                    </div>
                </div>

                <div className="bg-card rounded-xl p-6 border border-border flex flex-col justify-center space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-600">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <ArrowDownLeft className="h-5 w-5" />
                            </div>
                            <span className="font-medium text-sm">Total Received</span>
                        </div>
                        <span className="font-bold">{formatCurrency(125000)}</span>
                    </div>
                    <div className="w-full h-px bg-border" />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-rose-600">
                            <div className="p-2 bg-rose-100 rounded-lg">
                                <ArrowUpRight className="h-5 w-5" />
                            </div>
                            <span className="font-medium text-sm">Total Spent</span>
                        </div>
                        <span className="font-bold">{formatCurrency(90928.82)}</span>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between pt-4 gap-4 items-center">
                    <h2 className="text-xl font-semibold">Transaction History</h2>
                    <div className="relative w-full sm:w-auto min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search transactions..."
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
                                <TableHead className="w-[120px]">Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Method</TableHead>
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
                                            <div className="text-xs text-muted-foreground capitalize mt-0.5">{tx.category.replace('_', ' ')}</div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {tx.payment_method || "-"}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
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

            {/* Pay Service Fee Modal */}
            <Dialog open={isSendMoneyOpen} onOpenChange={setIsSendMoneyOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Pay Service Fee</DialogTitle>
                        <DialogDescription>
                            Pay the platform fee to the admin to initiate the service request.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="request-id">Service Request ID</Label>
                            <Input
                                id="request-id"
                                placeholder="e.g., SR-99321"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Fee Amount (INR)</Label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="0.00"
                                    className="pl-9"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            {amount && !isNaN(Number(amount)) && (
                                <p className="text-xs text-emerald-600 font-medium mt-1">
                                    You will earn {formatCurrency(Number(amount) * 0.15)} (15%) commission on this service.
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsSendMoneyOpen(false)}>Cancel</Button>
                        <Button onClick={handleSendMoney}>Pay Fee</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Withdraw Modal */}
            <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Withdraw Funds</DialogTitle>
                        <DialogDescription>
                            Transfer wallet balance directly to your linked bank account.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="rounded-md bg-muted p-3 text-sm flex justify-between items-center">
                            <span className="text-muted-foreground">Available to withdraw:</span>
                            <span className="font-bold text-foreground">{formatCurrency(mockWalletBalance)}</span>
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
                            <Label htmlFor="withdraw-amount">Amount (INR)</Label>
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
                        <Button onClick={handleWithdraw}>Request Withdrawal</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
