/* ───────────────────────────────────────────────────────────
 * Mock data for the FinFit kiosk dashboard.
 * This follows the ER schema: services, service_requests,
 * documents, payments, service_documents, request status logs,
 * request_statuses, verification_statuses.
 * ─────────────────────────────────────────────────────────── */

/* ── Lookup tables ──────────────────────────────────────────── */

export const requestStatuses = [
    { id: "rs_pending_admin_approval", name: "Pending Admin Approval" },
    { id: "rs_awaiting_details", name: "Awaiting Client Details" },
    { id: "rs_ready_for_payment", name: "Ready for Payment" },
    { id: "rs_in_progress", name: "In Progress" },
    { id: "rs_completed", name: "Completed" },
    { id: "rs_rejected", name: "Rejected" },
];

export const verificationStatuses = [
    { id: "vs_pending", name: "Pending" },
    { id: "vs_approved", name: "Approved" },
    { id: "vs_rejected", name: "Rejected" },
];

export function lookupName(
    table: { id: string; name: string }[],
    id: string
): string {
    return table.find((row) => row.id === id)?.name ?? id;
}

/* ── Services ───────────────────────────────────────────────── */

export const mockServices = [
    {
        id: "s1",
        name: "PAN Card Application",
        category_name: "Identity",
        description:
            "Apply for a new PAN card or reprint. Required for income tax filings and financial transactions.",
        base_price: 500,
        tax_percent: 18,
    },
    {
        id: "s2",
        name: "Aadhaar Update",
        category_name: "Identity",
        description:
            "Update address, mobile number, or biometrics on your Aadhaar card.",
        base_price: 200,
        tax_percent: 18,
    },
    {
        id: "s3",
        name: "Passport Application",
        category_name: "Travel",
        description:
            "New passport application or passport renewal with document verification.",
        base_price: 1500,
        tax_percent: 18,
    },
    {
        id: "s4",
        name: "Income Tax Filing",
        category_name: "Tax",
        description:
            "E-filing of personal or business income tax returns for the financial year.",
        base_price: 999,
        tax_percent: 18,
    },
    {
        id: "s5",
        name: "GST Registration",
        category_name: "Tax",
        description:
            "Register your business for Goods and Services Tax compliance.",
        base_price: 2000,
        tax_percent: 18,
    },
    {
        id: "s6",
        name: "Driving License Renewal",
        category_name: "Transport",
        description:
            "Renew your driving license before or after expiry date through our kiosk.",
        base_price: 600,
        tax_percent: 18,
    },
];

/* ── Service Requests ───────────────────────────────────────── */

export const mockServiceRequests = [
    {
        id: "sr001",
        service_id: "s1",
        service_name: "PAN Card Application",
        customer_id: "u3",
        customer_name: "John Doe",
        agent_id: "u2",
        agent_name: "Priya Sharma",
        kiosk_id: "k1",
        kiosk_name: "Downtown Kiosk",
        status: "in_progress",
        price_snapshot: 500,
        tax_snapshot: 90,
        total_amount_snapshot: 590,
        created_at: "2026-02-10T09:30:00Z",
        updated_at: "2026-02-18T14:00:00Z",
    },
    {
        id: "sr002",
        service_id: "s4",
        service_name: "Income Tax Filing",
        customer_id: "u3",
        customer_name: "John Doe",
        agent_id: "u4",
        agent_name: "Rahul Verma",
        kiosk_id: "k2",
        kiosk_name: "Park Street Kiosk",
        status: "completed",
        price_snapshot: 999,
        tax_snapshot: 179.82,
        total_amount_snapshot: 1178.82,
        created_at: "2026-01-05T11:00:00Z",
        updated_at: "2026-01-25T16:00:00Z",
    },
    {
        id: "sr003",
        service_id: "s3",
        service_name: "Passport Application",
        customer_id: "u3",
        customer_name: "John Doe",
        agent_id: "u2",
        agent_name: "Priya Sharma",
        kiosk_id: "k1",
        kiosk_name: "Downtown Kiosk",
        status: "pending_admin_approval",
        price_snapshot: 1500,
        tax_snapshot: 270,
        total_amount_snapshot: 1770,
        created_at: "2026-02-20T08:00:00Z",
        updated_at: "2026-02-20T08:00:00Z",
    },
    {
        id: "sr004",
        service_id: "s6",
        service_name: "Driving License Renewal",
        customer_id: "u3",
        customer_name: "John Doe",
        agent_id: "u5",
        agent_name: "Neha Gupta",
        kiosk_id: "k3",
        kiosk_name: "Mall Road Kiosk",
        status: "completed",
        price_snapshot: 600,
        tax_snapshot: 108,
        total_amount_snapshot: 708,
        created_at: "2025-12-12T10:30:00Z",
        updated_at: "2025-12-28T11:00:00Z",
    },
    {
        id: "sr005",
        service_id: "s5",
        service_name: "GST Registration",
        customer_id: "u3",
        customer_name: "John Doe",
        agent_id: "u2",
        agent_name: "Priya Sharma",
        kiosk_id: "k1",
        kiosk_name: "Downtown Kiosk",
        status: "awaiting_client_details",
        price_snapshot: 2000,
        tax_snapshot: 360,
        total_amount_snapshot: 2360,
        created_at: "2026-02-15T13:00:00Z",
        updated_at: "2026-02-22T09:00:00Z",
    },
    {
        id: "sr006",
        service_id: "s2",
        service_name: "Aadhaar Update",
        customer_id: "c4",
        customer_name: "Sneha Gupta",
        agent_id: "u2",
        agent_name: "Priya Sharma",
        kiosk_id: "k1",
        kiosk_name: "Downtown Kiosk",
        status: "ready_for_payment",
        price_snapshot: 200,
        tax_snapshot: 36,
        total_amount_snapshot: 236,
        created_at: "2026-02-27T10:00:00Z",
        updated_at: "2026-02-27T11:30:00Z",
    },
];

/* ── Service Documents (what docs each service needs) ────── */

export const mockServiceDocuments = [
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

/* ── Documents (uploaded files linked to service requests) ─ */

export interface Document {
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

export const mockDocuments: Document[] = [
    {
        id: "d1",
        service_request_id: "sr001",
        file_id: "f1",
        uploaded_by: "u3",
        uploaded_by_name: "John Doe",
        document_name: "ID Proof",
        verification_status_id: "vs_approved",
        rejection_reason: null,
        verified_by: "u2",
        file_url: "/uploads/id_proof.pdf",
        mime_type: "application/pdf",
        created_at: "2026-02-10T10:00:00Z",
    },
    {
        id: "d2",
        service_request_id: "sr001",
        file_id: "f2",
        uploaded_by: "u3",
        uploaded_by_name: "John Doe",
        document_name: "Address Proof",
        verification_status_id: "vs_pending",
        rejection_reason: null,
        verified_by: null,
        file_url: "/uploads/address_proof.jpg",
        mime_type: "image/jpeg",
        created_at: "2026-02-11T08:30:00Z",
    },
    {
        id: "d3",
        service_request_id: "sr002",
        file_id: "f3",
        uploaded_by: "u3",
        uploaded_by_name: "John Doe",
        document_name: "Form 16",
        verification_status_id: "vs_approved",
        rejection_reason: null,
        verified_by: "u4",
        file_url: "/uploads/form16.pdf",
        mime_type: "application/pdf",
        created_at: "2026-01-06T12:00:00Z",
    },
    {
        id: "d4",
        service_request_id: "sr002",
        file_id: "f4",
        uploaded_by: "u3",
        uploaded_by_name: "John Doe",
        document_name: "Bank Statement",
        verification_status_id: "vs_rejected",
        rejection_reason: "Statement is older than 6 months. Please upload a recent one.",
        verified_by: "u4",
        file_url: "/uploads/bank_stmt.pdf",
        mime_type: "application/pdf",
        created_at: "2026-01-06T12:05:00Z",
    },
    {
        id: "d5",
        service_request_id: "sr005",
        file_id: "f5",
        uploaded_by: "u3",
        uploaded_by_name: "John Doe",
        document_name: "Business PAN",
        verification_status_id: "vs_pending",
        rejection_reason: null,
        verified_by: null,
        file_url: "/uploads/business_pan.pdf",
        mime_type: "application/pdf",
        created_at: "2026-02-16T09:00:00Z",
    },
];

/* ── Payments ───────────────────────────────────────────────── */

export interface Payment {
    id: string;
    service_request_id: string;
    amount: number;
    payment_method: string;
    payment_status_id: string;
    payment_status: string;
    transaction_id: string;
    reference_number: string;
    created_at: string;
}

export const mockPayments: Payment[] = [
    {
        id: "p1",
        service_request_id: "sr002",
        amount: 1178.82,
        payment_method: "UPI",
        payment_status_id: "ps_success",
        payment_status: "completed",
        transaction_id: "pay_abc123xyz456",
        reference_number: "order_def789ghi012",
        created_at: "2026-01-08T14:30:00Z",
    },
    {
        id: "p2",
        service_request_id: "sr004",
        amount: 708,
        payment_method: "Card",
        payment_status_id: "ps_success",
        payment_status: "completed",
        transaction_id: "pay_mno345pqr678",
        reference_number: "order_stu901vwx234",
        created_at: "2025-12-14T16:00:00Z",
    },
];

/* ── Request Status Logs ───────────────────────────────────── */

export const mockRequestStatusLogs = [
    {
        id: "rsl1",
        service_request_id: "sr001",
        old_status_id: "rs_pending",
        new_status_id: "rs_in_progress",
        changed_by: "u2",
        changed_by_name: "Priya Sharma",
        changed_at: "2026-02-12T10:00:00Z",
    },
    {
        id: "rsl2",
        service_request_id: "sr002",
        old_status_id: "rs_pending",
        new_status_id: "rs_in_progress",
        changed_by: "u4",
        changed_by_name: "Rahul Verma",
        changed_at: "2026-01-07T09:30:00Z",
    },
    {
        id: "rsl3",
        service_request_id: "sr002",
        old_status_id: "rs_in_progress",
        new_status_id: "rs_completed",
        changed_by: "u4",
        changed_by_name: "Rahul Verma",
        changed_at: "2026-01-25T16:00:00Z",
    },
    {
        id: "rsl4",
        service_request_id: "sr004",
        old_status_id: "rs_pending",
        new_status_id: "rs_in_progress",
        changed_by: "u5",
        changed_by_name: "Neha Gupta",
        changed_at: "2025-12-14T11:00:00Z",
    },
    {
        id: "rsl5",
        service_request_id: "sr004",
        old_status_id: "rs_in_progress",
        new_status_id: "rs_completed",
        changed_by: "u5",
        changed_by_name: "Neha Gupta",
        changed_at: "2025-12-28T11:00:00Z",
    },
    {
        id: "rsl6",
        service_request_id: "sr005",
        old_status_id: "rs_pending",
        new_status_id: "rs_in_progress",
        changed_by: "u2",
        changed_by_name: "Priya Sharma",
        changed_at: "2026-02-18T09:00:00Z",
    },
];

/* ── Utility functions ──────────────────────────────────────── */

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(amount);
}

export function formatDate(dateStr: string): string {
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(dateStr));
}

export function formatDateTime(dateStr: string): string {
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(dateStr));
}

/* ── Clients (Users assisted by the Kiosk Agent) ────────────── */

export interface Client {
    id: string;
    name: string;
    phone: string;
    email: string;
    total_requests: number;
    created_at: string;
}

export const mockClients: Client[] = [
    {
        id: "c1",
        name: "Rahul Sharma",
        phone: "+91 9876543210",
        email: "rahul.sharma@example.com",
        total_requests: 3,
        created_at: "2025-10-12T10:00:00Z"
    },
    {
        id: "c2",
        name: "Priya Desai",
        phone: "+91 8765432109",
        email: "priya.d@example.com",
        total_requests: 1,
        created_at: "2026-01-05T14:30:00Z"
    },
    {
        id: "c3",
        name: "Amit Patel",
        phone: "+91 7654321098",
        email: "amit.patel@example.com",
        total_requests: 2,
        created_at: "2025-11-20T09:15:00Z"
    },
    {
        id: "c4",
        name: "Sneha Gupta",
        phone: "+91 6543210987",
        email: "sneha.g@example.com",
        total_requests: 4,
        created_at: "2025-08-30T16:45:00Z"
    },
    {
        id: "c5",
        name: "Vikram Singh",
        phone: "+91 5432109876",
        email: "vikram.singh@example.com",
        total_requests: 1,
        created_at: "2026-02-15T11:20:00Z"
    }
];

/* ── Wallet Transactions (Kiosk Balance Tracking) ───────────── */

export interface WalletTransaction {
    id: string;
    type: "credit" | "debit";
    category: "deposit" | "withdrawal" | "commission" | "payment" | "send_money";
    amount: number;
    description: string;
    reference: string | null;
    status: "completed" | "pending" | "failed";
    payment_method?: string; // e.g., Wallet, Cash, UPI
    created_at: string;
}

export const mockWalletTransactions: WalletTransaction[] = [
    {
        id: "wt1",
        type: "credit",
        category: "deposit",
        amount: 50000,
        description: "Wallet recharge via UPI",
        reference: "upi_tx_9283",
        status: "completed",
        created_at: "2026-02-01T10:00:00Z"
    },
    {
        id: "wt2",
        type: "debit",
        category: "payment",
        amount: 1178.82,
        description: "Payment for Income Tax Filing (John Doe)",
        reference: "sr002",
        status: "completed",
        payment_method: "Wallet",
        created_at: "2026-01-08T14:30:00Z"
    },
    {
        id: "wt3",
        type: "credit",
        category: "commission",
        amount: 250,
        description: "Commission for Income Tax Filing",
        reference: "sr002",
        status: "completed",
        payment_method: "Wallet",
        created_at: "2026-01-08T14:30:00Z"
    },
    {
        id: "wt4",
        type: "debit",
        category: "send_money",
        amount: 5000,
        description: "Sent money to Rahul Sharma",
        reference: "c1",
        status: "completed",
        created_at: "2026-02-15T16:45:00Z"
    },
    {
        id: "wt5",
        type: "debit",
        category: "withdrawal",
        amount: 10000,
        description: "Withdrawal to bank account ending in 4521",
        reference: "bank_tx_8213",
        status: "pending",
        created_at: "2026-02-28T14:00:00Z"
    }
];

export const mockWalletBalance = 34071.18;
