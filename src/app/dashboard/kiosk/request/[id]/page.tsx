"use client";

import { use, useState, useRef } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    FileText,
    Calendar,
    IndianRupee,
    MapPin,
    User,
    Clock,
    CheckCircle2,
    AlertCircle,
    File,
    Upload,
    CreditCard,
    Trash2,
    XCircle,
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
import { toast } from "sonner";

/* ── Inline types ── */

interface Document {
    id: string;
    service_request_id: string;
    file_id: string;
    uploaded_by: string;
    uploaded_by_name: string;
    document_name: string;
    verification_status_id: string;
    rejection_reason: string | null;
    verified_by: string | null;
    file_url: string;
    mime_type: string;
    created_at: string;
}

interface Payment {
    id: string;
    service_request_id: string;
    amount: number;
    payment_method: string;
    payment_status_id: string;
    transaction_id: string;
    reference_number: string;
    commission_earned?: number;
    created_at: string;
}

/* ── Inline mock data ── */

const requestStatuses = [
    { id: "rs_pending_admin_approval", name: "Pending Admin Approval" },
    { id: "rs_awaiting_details", name: "Awaiting Client Details" },
    { id: "rs_ready_for_payment", name: "Ready for Payment" },
    { id: "rs_in_progress", name: "In Progress" },
    { id: "rs_completed", name: "Completed" },
    { id: "rs_rejected", name: "Rejected" },
];

const verificationStatuses = [
    { id: "vs_pending", name: "Pending" },
    { id: "vs_approved", name: "Approved" },
    { id: "vs_rejected", name: "Rejected" },
];

function lookupName(table: { id: string; name: string }[], id: string) {
    return table.find((row) => row.id === id)?.name ?? id;
}

const mockServices = [
    { id: "s1", name: "PAN Card Application", tax_percent: 18 },
    { id: "s2", name: "Aadhaar Update", tax_percent: 18 },
    { id: "s3", name: "Passport Application", tax_percent: 18 },
    { id: "s4", name: "Income Tax Filing", tax_percent: 18 },
    { id: "s5", name: "GST Registration", tax_percent: 18 },
    { id: "s6", name: "Driving License Renewal", tax_percent: 18 },
];

const mockServiceRequests = [
    { id: "sr001", service_id: "s1", service_name: "PAN Card Application", customer_id: "u3", customer_name: "John Doe", agent_id: "u2", agent_name: "Priya Sharma", kiosk_id: "k1", kiosk_name: "Downtown Kiosk", status: "in_progress", price_snapshot: 500, tax_snapshot: 90, total_amount_snapshot: 590, created_at: "2026-02-10T09:30:00Z", updated_at: "2026-02-18T14:00:00Z" },
    { id: "sr002", service_id: "s4", service_name: "Income Tax Filing", customer_id: "u3", customer_name: "John Doe", agent_id: "u4", agent_name: "Rahul Verma", kiosk_id: "k2", kiosk_name: "Park Street Kiosk", status: "completed", price_snapshot: 999, tax_snapshot: 179.82, total_amount_snapshot: 1178.82, created_at: "2026-01-05T11:00:00Z", updated_at: "2026-01-25T16:00:00Z" },
    { id: "sr003", service_id: "s3", service_name: "Passport Application", customer_id: "u3", customer_name: "John Doe", agent_id: "u2", agent_name: "Priya Sharma", kiosk_id: "k1", kiosk_name: "Downtown Kiosk", status: "pending", price_snapshot: 1500, tax_snapshot: 270, total_amount_snapshot: 1770, created_at: "2026-02-20T08:00:00Z", updated_at: "2026-02-20T08:00:00Z" },
    { id: "sr004", service_id: "s6", service_name: "Driving License Renewal", customer_id: "u3", customer_name: "John Doe", agent_id: "u5", agent_name: "Neha Gupta", kiosk_id: "k3", kiosk_name: "Mall Road Kiosk", status: "completed", price_snapshot: 600, tax_snapshot: 108, total_amount_snapshot: 708, created_at: "2025-12-12T10:30:00Z", updated_at: "2025-12-28T11:00:00Z" },
    { id: "sr005", service_id: "s5", service_name: "GST Registration", customer_id: "u3", customer_name: "John Doe", agent_id: "u2", agent_name: "Priya Sharma", kiosk_id: "k1", kiosk_name: "Downtown Kiosk", status: "in_progress", price_snapshot: 2000, tax_snapshot: 360, total_amount_snapshot: 2360, created_at: "2026-02-15T13:00:00Z", updated_at: "2026-02-22T09:00:00Z" },
];

const mockServiceDocuments = [
    { id: "sd1", service_id: "s1", document_name: "ID Proof", is_mandatory: true },
    { id: "sd2", service_id: "s1", document_name: "Address Proof", is_mandatory: true },
    { id: "sd3", service_id: "s1", document_name: "Passport Photo", is_mandatory: true },
    { id: "sd4", service_id: "s3", document_name: "Old Passport Copy", is_mandatory: false },
    { id: "sd5", service_id: "s3", document_name: "Address Proof", is_mandatory: true },
    { id: "sd6", service_id: "s3", document_name: "ID Proof", is_mandatory: true },
    { id: "sd7", service_id: "s4", document_name: "Form 16", is_mandatory: true },
    { id: "sd8", service_id: "s4", document_name: "Bank Statement", is_mandatory: true },
    { id: "sd9", service_id: "s5", document_name: "Business PAN", is_mandatory: true },
    { id: "sd10", service_id: "s5", document_name: "Address Proof", is_mandatory: true },
    { id: "sd11", service_id: "s5", document_name: "Bank Account Details", is_mandatory: true },
    { id: "sd12", service_id: "s6", document_name: "Old License Copy", is_mandatory: true },
    { id: "sd13", service_id: "s6", document_name: "Address Proof", is_mandatory: true },
];

const initialDocuments: Document[] = [
    { id: "d1", service_request_id: "sr001", file_id: "f1", uploaded_by: "u3", uploaded_by_name: "John Doe", document_name: "ID Proof", verification_status_id: "vs_approved", rejection_reason: null, verified_by: "u2", file_url: "/uploads/id_proof.pdf", mime_type: "application/pdf", created_at: "2026-02-10T10:00:00Z" },
    { id: "d2", service_request_id: "sr001", file_id: "f2", uploaded_by: "u3", uploaded_by_name: "John Doe", document_name: "Address Proof", verification_status_id: "vs_pending", rejection_reason: null, verified_by: null, file_url: "/uploads/address_proof.jpg", mime_type: "image/jpeg", created_at: "2026-02-11T08:30:00Z" },
    { id: "d3", service_request_id: "sr002", file_id: "f3", uploaded_by: "u3", uploaded_by_name: "John Doe", document_name: "Form 16", verification_status_id: "vs_approved", rejection_reason: null, verified_by: "u4", file_url: "/uploads/form16.pdf", mime_type: "application/pdf", created_at: "2026-01-06T12:00:00Z" },
    { id: "d4", service_request_id: "sr002", file_id: "f4", uploaded_by: "u3", uploaded_by_name: "John Doe", document_name: "Bank Statement", verification_status_id: "vs_rejected", rejection_reason: "Statement is older than 6 months. Please upload a recent one.", verified_by: "u4", file_url: "/uploads/bank_stmt.pdf", mime_type: "application/pdf", created_at: "2026-01-06T12:05:00Z" },
    { id: "d5", service_request_id: "sr005", file_id: "f5", uploaded_by: "u3", uploaded_by_name: "John Doe", document_name: "Business PAN", verification_status_id: "vs_pending", rejection_reason: null, verified_by: null, file_url: "/uploads/business_pan.pdf", mime_type: "application/pdf", created_at: "2026-02-16T09:00:00Z" },
];

const initialPayments: Payment[] = [
    { id: "p1", service_request_id: "sr002", amount: 1178.82, payment_method: "Wallet", payment_status_id: "ps_success", payment_status: "completed", transaction_id: "pay_abc123xyz456", reference_number: "order_def789ghi012", commission_earned: 176.82, created_at: "2026-01-08T14:30:00Z" },
    { id: "p2", service_request_id: "sr004", amount: 708, payment_method: "Cash", payment_status_id: "ps_success", payment_status: "completed", transaction_id: "pay_mno345pqr678", reference_number: "order_stu901vwx234", commission_earned: 106.20, created_at: "2025-12-14T16:00:00Z" },
];

const mockRequestStatusLogs = [
    { id: "rsl1", service_request_id: "sr001", old_status_id: "rs_pending", new_status_id: "rs_in_progress", changed_by: "u2", changed_by_name: "Priya Sharma", changed_at: "2026-02-12T10:00:00Z" },
    { id: "rsl2", service_request_id: "sr002", old_status_id: "rs_pending", new_status_id: "rs_in_progress", changed_by: "u4", changed_by_name: "Rahul Verma", changed_at: "2026-01-07T09:30:00Z" },
    { id: "rsl3", service_request_id: "sr002", old_status_id: "rs_in_progress", new_status_id: "rs_completed", changed_by: "u4", changed_by_name: "Rahul Verma", changed_at: "2026-01-25T16:00:00Z" },
    { id: "rsl4", service_request_id: "sr004", old_status_id: "rs_pending", new_status_id: "rs_in_progress", changed_by: "u5", changed_by_name: "Neha Gupta", changed_at: "2025-12-14T11:00:00Z" },
    { id: "rsl5", service_request_id: "sr004", old_status_id: "rs_in_progress", new_status_id: "rs_completed", changed_by: "u5", changed_by_name: "Neha Gupta", changed_at: "2025-12-28T11:00:00Z" },
    { id: "rsl6", service_request_id: "sr005", old_status_id: "rs_pending", new_status_id: "rs_in_progress", changed_by: "u2", changed_by_name: "Priya Sharma", changed_at: "2026-02-18T09:00:00Z" },
];

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(amount);
}

function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(dateStr));
}

function formatDateTime(dateStr: string) {
    return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(dateStr));
}

/* ── Component ── */

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const request = mockServiceRequests.find(r => r.id === id);
    if (!request) return notFound();

    const service = mockServices.find(s => s.id === request.service_id);

    // Required docs for this service
    const requiredDocs = mockServiceDocuments.filter(d => d.service_id === request.service_id);

    // Local state for documents and payments (simulating CRUD)
    const [documents, setDocuments] = useState<Document[]>(() =>
        initialDocuments.filter(d => d.service_request_id === request.id)
    );
    const [payments, setPayments] = useState<Payment[]>(() =>
        initialPayments.filter(p => p.service_request_id === request.id)
    );

    // Upload states
    const [uploadDocName, setUploadDocName] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Payment states
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("Wallet");

    const statusLogs = mockRequestStatusLogs
        .filter(l => l.service_request_id === request.id)
        .sort((a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime());

    // Status badge styling
    let badgeClass = "bg-muted text-muted-foreground";
    if (request.status === "pending_admin_approval") badgeClass = "bg-purple-100 text-purple-700";
    if (request.status === "awaiting_client_details") badgeClass = "bg-yellow-100 text-yellow-700";
    if (request.status === "ready_for_payment") badgeClass = "bg-orange-100 text-orange-700";
    if (request.status === "in_progress") badgeClass = "bg-primary/10 text-primary";
    if (request.status === "completed") badgeClass = "bg-emerald-100 text-emerald-800";
    if (request.status === "rejected") badgeClass = "bg-red-100 text-red-700";
    const statusDisplay = request.status.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

    // ── Document Upload Handler ──
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error("File too large: Maximum file size is 10MB.");
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleUploadDocument = () => {
        if (!uploadDocName.trim()) {
            toast.error("Missing document name: Please select or enter a document name.");
            return;
        }
        if (!selectedFile) {
            toast.error("No file selected: Please choose a file to upload.");
            return;
        }

        setIsUploading(true);

        // Simulate upload (following ER: files → documents)
        setTimeout(() => {
            const now = new Date().toISOString();
            const fileId = `f_new_${Date.now()}`;
            const docId = `d_new_${Date.now()}`;

            const newDoc: Document = {
                id: docId,
                service_request_id: request.id,
                file_id: fileId,
                uploaded_by: "u3",
                uploaded_by_name: "John Doe",
                document_name: uploadDocName,
                verification_status_id: "vs_pending",
                rejection_reason: null,
                verified_by: null,
                file_url: `/uploads/${selectedFile.name}`,
                mime_type: selectedFile.type || "application/octet-stream",
                created_at: now,
            };

            setDocuments(prev => [...prev, newDoc]);
            setUploadDocName("");
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            setIsUploading(false);

            toast.success(`Document uploaded! "${uploadDocName}" has been uploaded and is pending verification.`);
        }, 1200);
    };

    const handleDeleteDocument = (docId: string, docName: string) => {
        setDocuments(prev => prev.filter(d => d.id !== docId));
        toast.info(`Document removed: "${docName}" has been deleted.`);
    };

    // ── Payment Handler (simulated with dummy data) ──
    const handlePayment = () => {
        setIsProcessingPayment(true);

        // Simulate payment processing
        setTimeout(() => {
            const now = new Date().toISOString();
            const txnId = `pay_${Math.random().toString(36).substring(2, 14)}`;
            const refNum = `order_${Math.random().toString(36).substring(2, 14)}`;

            const commission = request.total_amount_snapshot * 0.15;

            const newPayment: Payment = {
                id: `p_new_${Date.now()}`,
                service_request_id: request.id,
                amount: request.total_amount_snapshot,
                payment_method: paymentMethod,
                payment_status_id: "ps_success",
                payment_status: "completed",
                transaction_id: txnId,
                reference_number: refNum,
                commission_earned: commission,
                created_at: now,
            };

            setPayments(prev => [...prev, newPayment]);
            setIsProcessingPayment(false);
            toast.success(
                `Payment successful! ${formatCurrency(request.total_amount_snapshot)} paid via ${paymentMethod}.`,
                { description: `You earned a commission of ${formatCurrency(commission)}` }
            );
        }, 1500);
    };

    const hasSuccessfulPayment = payments.some(p => p.payment_status === "completed");

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Back + Header */}
            <div>
                <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2 text-muted-foreground hover:text-foreground">
                    <Link href="/dashboard/kiosk/request">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to requests
                    </Link>
                </Button>
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{request.service_name}</h1>
                        <p className="text-muted-foreground mt-0.5">Request ID: <span className="font-mono text-foreground">{request.id.toUpperCase()}</span></p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>
                        {statusDisplay}
                    </span>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl border border-border p-4 shadow-sm space-y-3">
                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Amount</p>
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Base Price</span>
                            <span>{formatCurrency(request.price_snapshot)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tax ({service?.tax_percent ?? 0}%)</span>
                            <span>{formatCurrency(request.tax_snapshot)}</span>
                        </div>
                        <div className="border-t border-border pt-1 flex justify-between text-sm font-semibold">
                            <span>Total</span>
                            <span className="text-primary">{formatCurrency(request.total_amount_snapshot)}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border p-4 shadow-sm space-y-3">
                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Details</p>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Created:</span>
                            <span>{formatDate(request.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Updated:</span>
                            <span>{formatDate(request.updated_at)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Service:</span>
                            <span>{service?.name}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border p-4 shadow-sm space-y-3">
                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Assigned</p>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Agent:</span>
                            <span>{request.agent_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Kiosk:</span>
                            <span>{request.kiosk_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Customer:</span>
                            <span>{request.customer_name}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* DOCUMENTS SECTION */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <File className="h-5 w-5 text-primary" />
                        Documents ({documents.length})
                    </h2>
                </div>

                {/* Required documents checklist */}
                {requiredDocs.length > 0 && (
                    <div className="bg-muted/30 rounded-lg p-4 border border-border space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Required Documents</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                            {requiredDocs.map((rd) => {
                                const uploaded = documents.some(d => d.document_name === rd.document_name);
                                return (
                                    <div key={rd.id} className="flex items-center gap-2 text-sm">
                                        {uploaded ? (
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                        ) : (
                                            <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                                        )}
                                        <span className={uploaded ? "text-foreground" : "text-muted-foreground"}>
                                            {rd.document_name}
                                        </span>
                                        {rd.is_mandatory && (
                                            <span className="text-[10px] font-semibold uppercase text-red-500">Required</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Uploaded documents list */}
                {documents.length > 0 && (
                    <div className="space-y-2.5">
                        {documents.map((doc) => {
                            const verStatus = lookupName(verificationStatuses, doc.verification_status_id);
                            let verColor = "text-yellow-600 bg-yellow-50";
                            if (verStatus === "Approved") verColor = "text-emerald-600 bg-emerald-50";
                            if (verStatus === "Rejected") verColor = "text-red-600 bg-red-50";

                            return (
                                <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <FileText className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{doc.document_name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {doc.uploaded_by_name} • {formatDate(doc.created_at)}
                                                {doc.mime_type && <span> • {doc.mime_type.split("/")[1]?.toUpperCase()}</span>}
                                            </p>
                                            {doc.rejection_reason && (
                                                <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                                                    <XCircle className="h-3 w-3" />
                                                    {doc.rejection_reason}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${verColor}`}>
                                            {verStatus}
                                        </span>
                                        {verStatus === "Pending" && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                                                onClick={() => handleDeleteDocument(doc.id, doc.document_name)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Upload form / Status Instructions */}
                <div className="border-t border-border pt-4 space-y-3">
                    {request.status === "pending_admin_approval" ? (
                        <div className="bg-purple-50 text-purple-700 p-4 rounded-lg flex items-center gap-3">
                            <AlertCircle className="h-5 w-5" />
                            <div>
                                <p className="font-semibold text-sm">Waiting for Admin Approval</p>
                                <p className="text-xs mt-0.5">You cannot upload documents until the admin approves this request.</p>
                            </div>
                        </div>
                    ) : request.status === "awaiting_client_details" ? (
                        <>
                            <p className="text-sm font-semibold flex items-center gap-2">
                                <Upload className="h-4 w-4 text-primary" />
                                Upload New Document
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <Select value={uploadDocName} onValueChange={setUploadDocName}>
                                    <SelectTrigger className="bg-background">
                                        <SelectValue placeholder="Select document type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {requiredDocs.map(rd => (
                                            <SelectItem key={rd.id} value={rd.document_name}>
                                                {rd.document_name} {rd.is_mandatory ? "(Required)" : "(Optional)"}
                                            </SelectItem>
                                        ))}
                                        <SelectItem value="Other">Other Document</SelectItem>
                                    </SelectContent>
                                </Select>

                                <div className="relative">
                                    <Input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                        onChange={handleFileSelect}
                                        className="bg-background file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-xs file:font-medium file:text-primary"
                                    />
                                </div>

                                <Button
                                    onClick={handleUploadDocument}
                                    disabled={isUploading || !selectedFile || !uploadDocName}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                                >
                                    <Upload className="h-4 w-4" />
                                    {isUploading ? "Uploading..." : "Upload"}
                                </Button>
                            </div>
                            {selectedFile && (
                                <p className="text-xs text-muted-foreground">
                                    Selected: <span className="font-medium text-foreground">{selectedFile.name}</span>
                                    {" "}({(selectedFile.size / 1024).toFixed(1)} KB)
                                </p>
                            )}
                        </>
                    ) : (
                        <div className="bg-muted/50 text-muted-foreground p-4 rounded-lg flex items-center justify-center">
                            <p className="text-sm">Document collection is complete.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* PAYMENT SECTION */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <IndianRupee className="h-5 w-5 text-primary" />
                        Payment
                    </h2>
                    {request.status === "ready_for_payment" && !hasSuccessfulPayment && (
                        <div className="flex items-center gap-3">
                            <Select value={paymentMethod} onValueChange={setPaymentMethod} disabled={isProcessingPayment}>
                                <SelectTrigger className="w-[140px] h-9 text-sm">
                                    <SelectValue placeholder="Method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Wallet">Wallet Balance</SelectItem>
                                    <SelectItem value="Cash">Cash Collected</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                size="sm"
                                onClick={handlePayment}
                                disabled={isProcessingPayment}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                            >
                                {isProcessingPayment ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="h-4 w-4" />
                                        Pay Service Fee
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>

                {request.status === "pending_admin_approval" || request.status === "awaiting_client_details" ? (
                    <div className="bg-muted/30 text-muted-foreground p-4 rounded-lg flex items-center justify-center text-center">
                        <p className="text-sm">Payment will be unlocked once all details are gathered and the request is ready.</p>
                    </div>
                ) : (
                    <>
                        {/* Amount breakdown */}
                        <div className="bg-muted/30 rounded-lg p-4 border border-border">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-muted-foreground">Base Price</span>
                                <span className="text-sm">{formatCurrency(request.price_snapshot)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-muted-foreground">Tax ({service?.tax_percent ?? 0}%)</span>
                                <span className="text-sm">{formatCurrency(request.tax_snapshot)}</span>
                            </div>
                            <div className="border-t border-border pt-2 flex justify-between items-center">
                                <span className="text-sm font-semibold">Total</span>
                                <span className="text-lg font-bold text-primary">{formatCurrency(request.total_amount_snapshot)}</span>
                            </div>
                        </div>

                        {/* Existing payments */}
                        {payments.length > 0 ? (
                            <div className="space-y-3">
                                <p className="text-sm font-semibold text-muted-foreground">Payment History</p>
                                {payments.map((p) => {
                                    let statusColor = "text-yellow-600";
                                    if (p.payment_status === "completed") statusColor = "text-emerald-600";
                                    if (p.payment_status === "failed") statusColor = "text-red-600";
                                    if (p.payment_status === "refunded") statusColor = "text-orange-500";

                                    return (
                                        <div key={p.id} className="rounded-lg border border-border p-4 bg-muted/20">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div>
                                                    <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-1">Amount</p>
                                                    <p className="font-semibold">{formatCurrency(p.amount)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-1">Method</p>
                                                    <p className="font-medium">{p.payment_method}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-1">Status</p>
                                                    <p className={`font-medium capitalize ${statusColor}`}>{p.payment_status}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-1">Commission</p>
                                                    <p className="font-semibold text-emerald-600">
                                                        {p.commission_earned ? `+${formatCurrency(p.commission_earned)}` : "-"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                                                <div className="flex items-center gap-6">
                                                    <span>TXN: <span className="font-mono text-foreground">{p.transaction_id}</span></span>
                                                    {p.reference_number && (
                                                        <span>Ref: <span className="font-mono text-foreground">{p.reference_number}</span></span>
                                                    )}
                                                </div>
                                                <span className="font-medium text-foreground">{formatDate(p.created_at)}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-4 text-center">
                                <p className="text-sm text-muted-foreground">No payments recorded yet.</p>
                                <p className="text-xs text-muted-foreground mt-1">Pay the fee above to initiate the request.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Status History */}
            {statusLogs.length > 0 && (
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Status History
                    </h2>
                    <div className="space-y-3">
                        {statusLogs.map((log) => {
                            const oldName = lookupName(requestStatuses, log.old_status_id);
                            const newName = lookupName(requestStatuses, log.new_status_id);
                            return (
                                <div key={log.id} className="flex items-center gap-4 p-3 rounded-lg border border-border bg-muted/20">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        {newName === "Completed" ? (
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                        ) : newName === "Rejected" ? (
                                            <AlertCircle className="h-4 w-4 text-red-500" />
                                        ) : (
                                            <Clock className="h-4 w-4 text-primary" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium">
                                            <span className="text-muted-foreground">{oldName}</span>
                                            <span className="mx-2">→</span>
                                            <span className="font-semibold">{newName}</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Changed by {log.changed_by_name} • {formatDateTime(log.changed_at)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="h-8"></div>
        </div>
    );
}
