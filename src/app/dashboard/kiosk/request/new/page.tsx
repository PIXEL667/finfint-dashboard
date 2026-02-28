"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    FilePlus,
    ArrowLeft,
    Info,
    CheckCircle2,
    Clock,
    IndianRupee,
    Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const mockClients = [
    { id: "c1", name: "John Doe", email: "john@gmail.com" },
    { id: "c2", name: "Sneha Gupta", email: "sneha@gmail.com" },
    { id: "c3", name: "Amit Patel", email: "amit@gmail.com" },
    { id: "c4", name: "Vikram Singh", email: "vikram@gmail.com" },
];

const mockServices = [
    { id: "s1", name: "PAN Card Application", category: "Identity", description: "Apply for a new PAN card or reprint.", base_price: 500, tax_percent: 18, commission_rate: 15, required_documents: ["ID Proof", "Address Proof", "Passport Photo"] },
    { id: "s2", name: "Aadhaar Update", category: "Identity", description: "Update address, phone, or name on Aadhaar.", base_price: 200, tax_percent: 18, commission_rate: 12, required_documents: ["Old Aadhaar Copy", "Address Proof"] },
    { id: "s3", name: "Passport Application", category: "Travel", description: "Apply for a new passport or renewal.", base_price: 1500, tax_percent: 18, commission_rate: 10, required_documents: ["Old Passport Copy", "Address Proof", "ID Proof"] },
    { id: "s4", name: "Income Tax Filing", category: "Tax", description: "File annual income tax returns.", base_price: 999, tax_percent: 18, commission_rate: 18, required_documents: ["Form 16", "Bank Statement"] },
    { id: "s5", name: "GST Registration", category: "Tax", description: "Register business for GST.", base_price: 2000, tax_percent: 18, commission_rate: 15, required_documents: ["Business PAN", "Address Proof", "Bank Account Details"] },
    { id: "s6", name: "Driving License Renewal", category: "Transport", description: "Renew expired driving license.", base_price: 600, tax_percent: 18, commission_rate: 12, required_documents: ["Old License Copy", "Address Proof"] },
];

function formatCurrency(n: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);
}

/* ── Component ── */

export default function KioskNewRequestPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [selectedClientId, setSelectedClientId] = useState("");
    const [selectedServiceId, setSelectedServiceId] = useState("");
    const [notes, setNotes] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [clientSearch, setClientSearch] = useState("");
    const [serviceSearch, setServiceSearch] = useState("");

    const filteredClients = mockClients.filter(c =>
        c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
        c.email.toLowerCase().includes(clientSearch.toLowerCase())
    );

    const filteredServices = mockServices.filter(s =>
        s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
        s.category.toLowerCase().includes(serviceSearch.toLowerCase())
    );

    const selectedService = mockServices.find(s => s.id === selectedServiceId);
    const selectedClient = mockClients.find(c => c.id === selectedClientId);
    const total = selectedService ? selectedService.base_price * (1 + selectedService.tax_percent / 100) : 0;
    const commission = selectedService ? (selectedService.base_price * selectedService.commission_rate / 100) : 0;

    const handleSubmit = () => {
        if (!title.trim()) {
            toast.error("Please provide a brief title for your request.");
            return;
        }
        if (!selectedClientId || !selectedServiceId) {
            toast.error("Please select both a client and a service type.");
            return;
        }
        setSubmitted(true);
        toast.success("Request created on behalf of client! Waiting for admin approval.");
    };

    if (submitted) {
        return (
            <div className="max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Request Created!</h1>
                    <p className="text-muted-foreground">
                        {selectedService?.name} for <strong>{selectedClient?.name}</strong> has been submitted.
                    </p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm w-full space-y-2">
                    <div className="flex justify-between">
                        <span className="text-emerald-700">Commission for this service:</span>
                        <span className="font-bold text-emerald-700">{formatCurrency(commission)}</span>
                    </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-700 w-full">
                    <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-semibold">Pending Admin Approval</p>
                            <p className="text-xs mt-1">Once approved, the client can upload documents and make payment.</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/kiosk/request">View All Requests</Link>
                    </Button>
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Link href="/dashboard/kiosk">Back to Dashboard</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" asChild className="rounded-lg">
                    <Link href="/dashboard/kiosk"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FilePlus className="h-6 w-6 text-emerald-600" /> Create New Service Request (on behalf)
                    </h1>
                    <p className="text-sm text-muted-foreground">Fill out the form to create a new service request for a client. You earn commission on completion.</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-5">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <p className="text-xs text-muted-foreground">A brief title for your request</p>
                            <Input
                                placeholder="e.g., Renew Driver License"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        {/* Client selection */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Select Client</Label>
                            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Choose a client" />
                                </SelectTrigger>
                                <SelectContent>
                                    <div className="p-2 sticky top-0 bg-card z-10">
                                        <Input
                                            placeholder="Search clients by name or email..."
                                            value={clientSearch}
                                            onChange={e => setClientSearch(e.target.value)}
                                            onKeyDown={e => e.stopPropagation()}
                                            onClick={e => e.stopPropagation()}
                                            className="h-8 shadow-none"
                                        />
                                    </div>
                                    {filteredClients.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-muted-foreground">No clients found.</div>
                                    ) : (
                                        filteredClients.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name} — {c.email}</SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Service selection */}
                        <div className="space-y-2">
                            <Label>Select a service type</Label>
                            <p className="text-xs text-muted-foreground">Choose the type of service you need</p>
                            <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Choose a service" />
                                </SelectTrigger>
                                <SelectContent>
                                    <div className="p-2 sticky top-0 bg-card z-10">
                                        <Input
                                            placeholder="Search services..."
                                            value={serviceSearch}
                                            onChange={e => setServiceSearch(e.target.value)}
                                            onKeyDown={e => e.stopPropagation()}
                                            onClick={e => e.stopPropagation()}
                                            className="h-8 shadow-none"
                                        />
                                    </div>
                                    {filteredServices.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-muted-foreground">No services found.</div>
                                    ) : (
                                        filteredServices.map(s => (
                                            <SelectItem key={s.id} value={s.id}>
                                                {s.name} — {formatCurrency(s.base_price)}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Service details */}
                        {selectedService && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-emerald-700">{selectedService.name}</h3>
                                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">{selectedService.category}</span>
                                </div>
                                <p className="text-sm text-emerald-600/80">{selectedService.description}</p>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Required Documents</p>
                                    <ul className="text-sm text-emerald-600 space-y-1">
                                        {selectedService.required_documents.map(d => (
                                            <li key={d} className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {d}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="pt-2 border-t border-emerald-200 space-y-1 text-sm">
                                    <div className="flex justify-between"><span className="text-emerald-600">Base Price</span><span>{formatCurrency(selectedService.base_price)}</span></div>
                                    <div className="flex justify-between"><span className="text-emerald-600">Tax ({selectedService.tax_percent}%)</span><span>{formatCurrency(selectedService.base_price * selectedService.tax_percent / 100)}</span></div>
                                    <div className="flex justify-between font-bold text-emerald-700 pt-1 border-t border-emerald-200"><span>Total</span><span>{formatCurrency(total)}</span></div>
                                </div>
                                <div className="bg-white/50 border border-emerald-200 rounded-lg p-3 flex items-center justify-between">
                                    <span className="text-sm text-emerald-700 flex items-center gap-1.5">
                                        <IndianRupee className="h-3.5 w-3.5" /> Your Commission ({selectedService.commission_rate}%)
                                    </span>
                                    <span className="font-bold text-emerald-700 text-lg">{formatCurrency(commission)}</span>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <p className="text-xs text-muted-foreground">Include any relevant details that will help us process your request</p>
                            <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Provide a detailed description of your request..." rows={4} />
                        </div>

                        <Button onClick={handleSubmit} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={!selectedClientId || !selectedServiceId}>
                            Submit Request
                        </Button>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-2">
                    <div className="bg-card rounded-xl border border-border p-5 shadow-sm sticky top-20 space-y-4">
                        <h3 className="font-bold flex items-center gap-2"><Info className="h-4 w-4 text-emerald-600" /> Process</h3>
                        <ol className="text-sm text-muted-foreground space-y-3">
                            {[
                                { step: "1", title: "Select Client & Service", desc: "Choose the client and service." },
                                { step: "2", title: "Submit Request", desc: "Request goes to admin." },
                                { step: "3", title: "Admin Approval", desc: "Admin reviews and approves." },
                                { step: "4", title: "Client Action", desc: "Client uploads docs and pays." },
                                { step: "5", title: "Commission Earned", desc: "You earn commission on completion." },
                            ].map(item => (
                                <li key={item.step} className="flex gap-3">
                                    <span className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">{item.step}</span>
                                    <div>
                                        <p className="font-medium text-foreground">{item.title}</p>
                                        <p className="text-xs">{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}
