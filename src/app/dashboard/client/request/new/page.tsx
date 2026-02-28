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

const mockServices = [
    { id: "s1", name: "PAN Card Application", category: "Identity", description: "Apply for a new PAN card or reprint.", base_price: 500, tax_percent: 18, required_documents: ["ID Proof", "Address Proof", "Passport Photo"] },
    { id: "s2", name: "Aadhaar Update", category: "Identity", description: "Update address, phone, or name on Aadhaar.", base_price: 200, tax_percent: 18, required_documents: ["Old Aadhaar Copy", "Address Proof"] },
    { id: "s3", name: "Passport Application", category: "Travel", description: "Apply for a new passport or renewal.", base_price: 1500, tax_percent: 18, required_documents: ["Old Passport Copy", "Address Proof", "ID Proof"] },
    { id: "s4", name: "Income Tax Filing", category: "Tax", description: "File your annual income tax returns.", base_price: 999, tax_percent: 18, required_documents: ["Form 16", "Bank Statement"] },
    { id: "s5", name: "GST Registration", category: "Tax", description: "Register your business for GST.", base_price: 2000, tax_percent: 18, required_documents: ["Business PAN", "Address Proof", "Bank Account Details"] },
    { id: "s6", name: "Driving License Renewal", category: "Transport", description: "Renew your expired driving license.", base_price: 600, tax_percent: 18, required_documents: ["Old License Copy", "Address Proof"] },
];

function formatCurrency(n: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);
}

/* ── Component ── */

export default function NewRequestPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [selectedServiceId, setSelectedServiceId] = useState("");
    const [notes, setNotes] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const selectedService = mockServices.find(s => s.id === selectedServiceId);
    const total = selectedService ? selectedService.base_price * (1 + selectedService.tax_percent / 100) : 0;

    const handleSubmit = () => {
        if (!title.trim()) {
            toast.error("Please provide a brief title for your request.");
            return;
        }
        if (!selectedServiceId) {
            toast.error("Please select a service type.");
            return;
        }
        setSubmitted(true);
        toast.success("Request submitted! Waiting for admin approval.");
    };

    if (submitted) {
        return (
            <div className="max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="h-20 w-20 rounded-full bg-sky-100 flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-sky-600" />
                </div>AVA
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Request Submitted!</h1>
                    <p className="text-muted-foreground">
                        Your request for <strong>{selectedService?.name}</strong> has been submitted.
                    </p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-700 w-full">
                    <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-semibold">Pending Admin Approval</p>
                            <p className="text-xs mt-1">Once approved by admin, you can upload your documents and make payment.</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/client/request">View All Requests</Link>
                    </Button>
                    <Button asChild className="bg-sky-600 hover:bg-sky-700 text-white">
                        <Link href="/dashboard/client">Back to Dashboard</Link>
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
                    <Link href="/dashboard/client"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FilePlus className="h-6 w-6 text-sky-600" /> Create New Service Request
                    </h1>
                    <p className="text-sm text-muted-foreground">Fill out the form to create a new service request</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
                {/* Form */}
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

                        <div className="space-y-2">
                            <Label>Select a service type</Label>
                            <p className="text-xs text-muted-foreground">Choose the type of service you need</p>
                            <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                                <SelectTrigger className="bg-background"><SelectValue placeholder="Choose a service" /></SelectTrigger>
                                <SelectContent>
                                    {mockServices.map(s => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.name} — {formatCurrency(s.base_price)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedService && (
                            <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-sky-700">{selectedService.name}</h3>
                                    <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded">{selectedService.category}</span>
                                </div>
                                <p className="text-sm text-sky-600/80">{selectedService.description}</p>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-sky-700 uppercase tracking-wider">Required Documents</p>
                                    <ul className="text-sm text-sky-600 space-y-1">
                                        {selectedService.required_documents.map(d => (
                                            <li key={d} className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                                                {d}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="pt-2 border-t border-sky-200 space-y-1 text-sm">
                                    <div className="flex justify-between"><span className="text-sky-600">Base Price</span><span>{formatCurrency(selectedService.base_price)}</span></div>
                                    <div className="flex justify-between"><span className="text-sky-600">Tax ({selectedService.tax_percent}%)</span><span>{formatCurrency(selectedService.base_price * selectedService.tax_percent / 100)}</span></div>
                                    <div className="flex justify-between font-bold text-sky-700 pt-1 border-t border-sky-200"><span>Total</span><span>{formatCurrency(total)}</span></div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <p className="text-xs text-muted-foreground">Include any relevant details that will help us process your request</p>
                            <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Provide a detailed description of your request..." rows={4} />
                        </div>

                        <Button onClick={handleSubmit} className="w-full bg-sky-600 hover:bg-sky-700 text-white" disabled={!selectedServiceId}>
                            Submit Request
                        </Button>
                    </div>
                </div>

                {/* Sidebar info */}
                <div className="lg:col-span-2">
                    <div className="bg-card rounded-xl border border-border p-5 shadow-sm sticky top-20 space-y-4">
                        <h3 className="font-bold flex items-center gap-2"><Info className="h-4 w-4 text-sky-600" /> How It Works</h3>
                        <ol className="text-sm text-muted-foreground space-y-3">
                            {[
                                { step: "1", title: "Submit Request", desc: "Choose a service and submit your request.", active: true },
                                { step: "2", title: "Admin Approval", desc: "Admin reviews and approves your request." },
                                { step: "3", title: "Upload Documents", desc: "Upload required documents once approved." },
                                { step: "4", title: "Make Payment", desc: "Pay for the service after uploading docs." },
                                { step: "5", title: "Completion", desc: "Service is processed and completed." },
                            ].map(item => (
                                <li key={item.step} className="flex gap-3">
                                    <span className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${item.active ? "bg-sky-600 text-white" : "bg-muted text-muted-foreground"}`}>
                                        {item.step}
                                    </span>
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
