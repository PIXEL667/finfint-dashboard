"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Users, Search, Mail, KeyRound, CheckCircle2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

/* ── Inline mock data ── */

interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    created_at: string;
    total_requests: number;
    status: string;
}

const initialClients: Client[] = [
    { id: "c1", name: "John Doe", email: "john@gmail.com", phone: "+91 98765 43210", created_at: "2026-01-10", total_requests: 3, status: "active" },
    { id: "c2", name: "Sneha Gupta", email: "sneha@gmail.com", phone: "+91 87654 32109", created_at: "2025-12-05", total_requests: 2, status: "active" },
    { id: "c3", name: "Amit Patel", email: "amit@gmail.com", phone: "+91 76543 21098", created_at: "2026-02-01", total_requests: 1, status: "active" },
    { id: "c4", name: "Vikram Singh", email: "vikram@gmail.com", phone: "+91 65432 10987", created_at: "2026-02-15", total_requests: 1, status: "active" },
];

/* ── Component ── */

export default function KioskClientsPage() {
    const [clients, setClients] = useState<Client[]>(initialClients);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Create client form
    const [form, setForm] = useState({ name: "", email: "", phone: "" });
    const [otpStep, setOtpStep] = useState<"form" | "otp" | "done">("form");
    const [otp, setOtp] = useState("");

    const filtered = clients.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const resetCreate = () => {
        setForm({ name: "", email: "", phone: "" });
        setOtpStep("form");
        setOtp("");
    };

    const handleSendOtp = () => {
        if (!form.name || !form.email || !form.phone) {
            toast.error("Please fill all fields.");
            return;
        }
        if (!form.email.includes("@")) {
            toast.error("Please enter a valid email.");
            return;
        }
        toast.success(`OTP sent to ${form.email}! (Use 123456 for demo)`);
        setOtpStep("otp");
    };

    const handleVerifyOtp = () => {
        if (otp === "123456") {
            const newClient: Client = {
                id: `c${Date.now()}`,
                name: form.name,
                email: form.email,
                phone: form.phone,
                created_at: new Date().toISOString().split("T")[0],
                total_requests: 0,
                status: "active",
            };
            setClients(prev => [...prev, newClient]);
            setOtpStep("done");
            toast.success(`Client "${form.name}" created & verified!`);
        } else {
            toast.error("Invalid OTP. Use 123456 for demo.");
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Users className="h-6 w-6 text-emerald-600" /> My Clients
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage clients and create service requests on their behalf.</p>
                </div>
                <Button onClick={() => { resetCreate(); setIsCreateOpen(true); }} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Create Client
                </Button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search clients..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 bg-background" />
                </div>
                <span className="text-sm text-muted-foreground">{filtered.length} clients</span>
            </div>

            {/* Clients Table */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead className="hidden md:table-cell">Phone</TableHead>
                            <TableHead className="hidden sm:table-cell">Created</TableHead>
                            <TableHead className="text-center">Requests</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">No clients found.</TableCell>
                            </TableRow>
                        ) : (
                            filtered.map(c => (
                                <TableRow key={c.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs shrink-0">
                                                {c.name.split(" ").map(n => n[0]).join("")}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{c.name}</p>
                                                <p className="text-xs text-muted-foreground">{c.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{c.phone}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">{c.created_at}</TableCell>
                                    <TableCell className="text-center">
                                        <span className="font-semibold">{c.total_requests}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs">Active</Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Create Client Dialog with OTP */}
            <Dialog open={isCreateOpen} onOpenChange={open => { if (!open) { setIsCreateOpen(false); resetCreate(); } }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create New Client</DialogTitle>
                        <DialogDescription>
                            {otpStep === "form" && "Enter client details. An OTP will be sent to their email."}
                            {otpStep === "otp" && `Verify OTP sent to ${form.email}`}
                            {otpStep === "done" && "Client created and verified!"}
                        </DialogDescription>
                    </DialogHeader>

                    {otpStep === "form" && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Client's full name" />
                            </div>
                            <div className="space-y-2">
                                <Label>Email (Gmail)</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="client@gmail.com" className="pl-10" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
                            </div>
                        </div>
                    )}

                    {otpStep === "otp" && (
                        <div className="space-y-4 py-4">
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-700 flex items-center gap-2">
                                <Sparkles className="h-3.5 w-3.5" />
                                OTP sent to <strong>{form.email}</strong>
                            </div>
                            <div className="space-y-2">
                                <Label>Enter OTP</Label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={otp}
                                        onChange={e => setOtp(e.target.value)}
                                        placeholder="6-digit OTP"
                                        maxLength={6}
                                        className="pl-10 tracking-widest text-center text-lg"
                                        onKeyDown={e => { if (e.key === "Enter") handleVerifyOtp(); }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {otpStep === "done" && (
                        <div className="flex flex-col items-center py-6 space-y-3">
                            <CheckCircle2 className="h-14 w-14 text-emerald-500" />
                            <p className="font-semibold text-lg">{form.name}</p>
                            <p className="text-sm text-muted-foreground">{form.email} — Verified</p>
                        </div>
                    )}

                    <DialogFooter>
                        {otpStep === "form" && (
                            <>
                                <Button variant="outline" onClick={() => { setIsCreateOpen(false); resetCreate(); }}>Cancel</Button>
                                <Button onClick={handleSendOtp} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                    <Mail className="mr-2 h-4 w-4" /> Send OTP
                                </Button>
                            </>
                        )}
                        {otpStep === "otp" && (
                            <>
                                <Button variant="outline" onClick={() => setOtpStep("form")}>Back</Button>
                                <Button onClick={handleVerifyOtp} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                    <KeyRound className="mr-2 h-4 w-4" /> Verify
                                </Button>
                            </>
                        )}
                        {otpStep === "done" && (
                            <Button onClick={() => { setIsCreateOpen(false); resetCreate(); }} className="bg-emerald-600 hover:bg-emerald-700 text-white w-full">Done</Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
