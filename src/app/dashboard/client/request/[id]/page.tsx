"use client";

import { use, useState, useRef } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    FileText,
    Calendar,
    IndianRupee,
    User,
    Clock,
    CheckCircle2,
    AlertCircle,
    Upload,
    CreditCard,
    Trash2,
    XCircle,
    Lock,
    File,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

/* ── Inline mock data ── */

interface UploadedDoc {
    id: string;
    name: string;
    fileName: string;
    size: string;
    status: "pending" | "approved" | "rejected";
    rejection_reason?: string;
}

interface MockRequest {
    id: string;
    service_name: string;
    category: string;
    status: string;
    base_price: number;
    tax: number;
    total: number;
    created_at: string;
    required_documents: string[];
    uploaded_documents: UploadedDoc[];
    payment_status: string;
    payment_method?: string;
    payment_date?: string;
}

const mockRequests: MockRequest[] = [
    {
        id: "sr001", service_name: "PAN Card Application", category: "Identity", status: "pending_admin_approval",
        base_price: 500, tax: 90, total: 590, created_at: "2026-02-10",
        required_documents: ["ID Proof", "Address Proof", "Passport Photo"],
        uploaded_documents: [], payment_status: "unpaid",
    },
    {
        id: "sr002", service_name: "Income Tax Filing", category: "Tax", status: "completed",
        base_price: 999, tax: 179.82, total: 1178.82, created_at: "2026-01-05",
        required_documents: ["Form 16", "Bank Statement"],
        uploaded_documents: [
            { id: "d1", name: "Form 16", fileName: "form16_2026.pdf", size: "2.1 MB", status: "approved" },
            { id: "d2", name: "Bank Statement", fileName: "bank_stmt.pdf", size: "1.8 MB", status: "approved" },
        ],
        payment_status: "paid", payment_method: "UPI", payment_date: "2026-01-06",
    },
    {
        id: "sr003", service_name: "Passport Application", category: "Travel", status: "approved",
        base_price: 1500, tax: 270, total: 1770, created_at: "2026-02-20",
        required_documents: ["Old Passport Copy", "Address Proof", "ID Proof"],
        uploaded_documents: [
            { id: "d3", name: "Old Passport Copy", fileName: "passport_scan.pdf", size: "3.2 MB", status: "approved" },
        ],
        payment_status: "unpaid",
    },
    {
        id: "sr004", service_name: "Driving License Renewal", category: "Transport", status: "completed",
        base_price: 600, tax: 108, total: 708, created_at: "2025-12-12",
        required_documents: ["Old License Copy", "Address Proof"],
        uploaded_documents: [
            { id: "d4", name: "Old License Copy", fileName: "license.jpg", size: "1.5 MB", status: "approved" },
            { id: "d5", name: "Address Proof", fileName: "utility_bill.pdf", size: "0.8 MB", status: "approved" },
        ],
        payment_status: "paid", payment_method: "Card", payment_date: "2025-12-13",
    },
    {
        id: "sr005", service_name: "GST Registration", category: "Tax", status: "pending_admin_approval",
        base_price: 2000, tax: 360, total: 2360, created_at: "2026-02-15",
        required_documents: ["Business PAN", "Address Proof", "Bank Account Details"],
        uploaded_documents: [], payment_status: "unpaid",
    },
];

function formatCurrency(n: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);
}

/* ── Component ── */

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const reqData = mockRequests.find(r => r.id === id);
    if (!reqData) notFound();

    const [request, setRequest] = useState<MockRequest>({ ...reqData, uploaded_documents: [...reqData.uploaded_documents] });
    const [paymentMethod, setPaymentMethod] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingFor, setUploadingFor] = useState<string | null>(null);

    const isApproved = request.status === "approved" || request.status === "in_progress" || request.status === "completed";
    const isPending = request.status === "pending_admin_approval";
    const allDocsUploaded = request.required_documents.every(d =>
        request.uploaded_documents.some(ud => ud.name === d && ud.status !== "rejected")
    );
    const canPay = isApproved && allDocsUploaded && request.payment_status !== "paid";

    const getStatusConfig = (status: string) => {
        const map: Record<string, { class: string; label: string; icon: typeof CheckCircle2 }> = {
            pending_admin_approval: { class: "bg-amber-100 text-amber-700", label: "Pending Admin Approval", icon: Clock },
            approved: { class: "bg-blue-100 text-blue-700", label: "Approved", icon: CheckCircle2 },
            in_progress: { class: "bg-violet-100 text-violet-700", label: "In Progress", icon: Clock },
            completed: { class: "bg-emerald-100 text-emerald-700", label: "Completed", icon: CheckCircle2 },
            rejected: { class: "bg-red-100 text-red-700", label: "Rejected", icon: XCircle },
        };
        return map[status] || { class: "bg-muted text-muted-foreground", label: status, icon: Clock };
    };

    const handleFileUpload = (docName: string, file: globalThis.File) => {
        const newDoc: UploadedDoc = {
            id: `d${Date.now()}`,
            name: docName,
            fileName: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            status: "pending",
        };
        setRequest(prev => ({
            ...prev,
            uploaded_documents: [...prev.uploaded_documents, newDoc],
        }));
        toast.success(`"${docName}" uploaded successfully!`);
        setUploadingFor(null);
    };

    const handleDeleteDoc = (docId: string) => {
        setRequest(prev => ({
            ...prev,
            uploaded_documents: prev.uploaded_documents.filter(d => d.id !== docId),
        }));
        toast.info("Document removed.");
    };

    const handlePayment = () => {
        if (!paymentMethod) {
            toast.error("Please select a payment method.");
            return;
        }
        setRequest(prev => ({
            ...prev,
            payment_status: "paid",
            payment_method: paymentMethod,
            payment_date: new Date().toISOString().split("T")[0],
            status: "in_progress",
        }));
        toast.success("Payment successful! Your request is now being processed.");
    };

    const statusConfig = getStatusConfig(request.status);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" asChild className="rounded-lg">
                    <Link href="/dashboard/client/request"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">{request.service_name}</h1>
                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig.class}`}>
                            <statusConfig.icon className="h-3 w-3" />{statusConfig.label}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{request.id.toUpperCase()} • {request.category}</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Request Info */}
                    <div className="bg-card rounded-xl border border-border p-5 shadow-sm space-y-4">
                        <h2 className="font-bold flex items-center gap-2"><FileText className="h-4 w-4 text-sky-600" /> Request Details</h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Date</span><span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-muted-foreground" />{request.created_at}</span></div>
                            <div><span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Customer</span><span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-muted-foreground" />John Doe</span></div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-4 border border-border space-y-1 text-sm">
                            <div className="flex justify-between"><span className="text-muted-foreground">Base Price</span><span>{formatCurrency(request.base_price)}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatCurrency(request.tax)}</span></div>
                            <div className="border-t border-border pt-1 flex justify-between font-bold"><span>Total</span><span className="text-sky-600">{formatCurrency(request.total)}</span></div>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="bg-card rounded-xl border border-border p-5 shadow-sm space-y-4">
                        <h2 className="font-bold flex items-center gap-2"><Upload className="h-4 w-4 text-sky-600" /> Documents</h2>

                        {isPending && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-700 flex items-start gap-2">
                                <Lock className="h-4 w-4 mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-semibold">Waiting for Admin Approval</p>
                                    <p className="text-xs mt-0.5">You can upload documents once your request is approved.</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            {request.required_documents.map(docName => {
                                const uploaded = request.uploaded_documents.find(d => d.name === docName);
                                return (
                                    <div key={docName} className="border border-border rounded-lg p-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {uploaded ? (
                                                    uploaded.status === "approved" ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> :
                                                        uploaded.status === "rejected" ? <XCircle className="h-4 w-4 text-red-500" /> :
                                                            <Clock className="h-4 w-4 text-amber-500" />
                                                ) : (
                                                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                                                )}
                                                <span className="font-medium text-sm">{docName}</span>
                                                {uploaded && (
                                                    <Badge variant="secondary" className={`text-[10px] ${uploaded.status === "approved" ? "bg-emerald-100 text-emerald-700" : uploaded.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                                                        {uploaded.status}
                                                    </Badge>
                                                )}
                                            </div>
                                            {uploaded && uploaded.status === "pending" && (
                                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500" onClick={() => handleDeleteDoc(uploaded.id)}>
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            )}
                                        </div>

                                        {uploaded && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground pl-6">
                                                <File className="h-3 w-3" />
                                                {uploaded.fileName} ({uploaded.size})
                                            </div>
                                        )}

                                        {uploaded?.status === "rejected" && uploaded.rejection_reason && (
                                            <p className="text-xs text-red-600 pl-6">Reason: {uploaded.rejection_reason}</p>
                                        )}

                                        {!uploaded && isApproved && request.payment_status !== "paid" && (
                                            <>
                                                <input ref={uploadingFor === docName ? fileInputRef : null} type="file" className="hidden" onChange={e => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleFileUpload(docName, file);
                                                }} />
                                                <Button variant="outline" size="sm" className="ml-6 text-xs" onClick={() => {
                                                    setUploadingFor(docName);
                                                    setTimeout(() => fileInputRef.current?.click(), 100);
                                                }}>
                                                    <Upload className="mr-1 h-3 w-3" /> Upload
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-card rounded-xl border border-border p-5 shadow-sm space-y-4">
                        <h2 className="font-bold flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-sky-600" /> Payment
                        </h2>

                        {request.payment_status === "paid" ? (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-emerald-700">Payment Successful</p>
                                    <p className="text-xs text-emerald-600 mt-1">
                                        {formatCurrency(request.total)} paid via {request.payment_method} on {request.payment_date}
                                    </p>
                                </div>
                            </div>
                        ) : !isApproved ? (
                            <div className="bg-muted/30 border border-border rounded-lg p-4 flex items-start gap-3 text-muted-foreground">
                                <Lock className="h-5 w-5 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-foreground">Payment Locked</p>
                                    <p className="text-xs mt-1">Payment is available only after admin approval and document upload.</p>
                                </div>
                            </div>
                        ) : !allDocsUploaded ? (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 text-amber-700">
                                <AlertCircle className="h-5 w-5 mt-0.5" />
                                <div>
                                    <p className="font-semibold">Upload All Documents First</p>
                                    <p className="text-xs mt-1">Please upload all required documents before making payment.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sky-700 font-medium">Amount Due</span>
                                        <span className="text-xl font-bold text-sky-700">{formatCurrency(request.total)}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Payment Method</label>
                                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                        <SelectTrigger><SelectValue placeholder="Select payment method" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="upi">UPI</SelectItem>
                                            <SelectItem value="netbanking">Net Banking</SelectItem>
                                            <SelectItem value="card">Credit/Debit Card</SelectItem>
                                            <SelectItem value="cash">Cash</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={handlePayment} className="w-full bg-sky-600 hover:bg-sky-700 text-white" disabled={!paymentMethod}>
                                    <IndianRupee className="mr-1 h-4 w-4" /> Pay {formatCurrency(request.total)}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar — Flow tracker */}
                <div className="lg:col-span-2">
                    <div className="bg-card rounded-xl border border-border p-5 shadow-sm sticky top-20 space-y-4">
                        <h3 className="font-bold text-sm">Request Progress</h3>
                        <div className="space-y-0">
                            {[
                                { step: "Request Submitted", desc: "You submitted a request.", done: true },
                                { step: "Admin Approval", desc: isPending ? "Waiting for admin…" : "Admin approved your request.", done: isApproved },
                                { step: "Upload Documents", desc: allDocsUploaded ? "All documents uploaded." : "Upload required documents.", done: allDocsUploaded && isApproved },
                                { step: "Make Payment", desc: request.payment_status === "paid" ? "Payment received." : "Pay for the service.", done: request.payment_status === "paid" },
                                { step: "Completed", desc: request.status === "completed" ? "Service completed!" : "Awaiting completion.", done: request.status === "completed" },
                            ].map((item, i, arr) => (
                                <div key={item.step} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${item.done ? "bg-sky-600 text-white" : "bg-muted text-muted-foreground border-2 border-border"}`}>
                                            {item.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                                        </div>
                                        {i < arr.length - 1 && (
                                            <div className={`w-0.5 h-8 ${item.done ? "bg-sky-600" : "bg-border"}`} />
                                        )}
                                    </div>
                                    <div className="pb-6">
                                        <p className={`text-sm font-medium ${item.done ? "text-foreground" : "text-muted-foreground"}`}>{item.step}</p>
                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
