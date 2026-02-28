"use client";

import { useState } from "react";
import {
    Users as UsersIcon,
    Search,
    Shield,
    UserCircle,
    Store,
    MoreHorizontal,
    Ban,
    CheckCircle,
    Eye,
    Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { UserPlus, IndianRupee } from "lucide-react";

/* ── Inline mock data ── */

interface AgentClient {
    id: string;
    name: string;
    email: string;
    phone: string;
    services: string[];
}

interface AgentPayment {
    id: string;
    date: string;
    amount: number;
    description: string;
    status: "completed" | "pending";
}

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: "admin" | "kiosk" | "customer";
    status: "active" | "blocked";
    join_date: string;
    transactions?: number; // Only for kiosk/customer
    clients?: AgentClient[];
    payments?: AgentPayment[];
}

const initialUsers: User[] = [
    { id: "u001", name: "Aryan Admin", email: "admin@finfint.com", phone: "+91 9876543210", role: "admin", status: "active", join_date: "2024-01-15T10:00:00Z" },
    {
        id: "u002", name: "Priya Sharma", email: "priya.kiosk@example.com", phone: "+91 9988776655", role: "kiosk", status: "active", join_date: "2025-06-20T14:30:00Z", transactions: 145,
        clients: [
            { id: "c1", name: "Ramesh Kumar", email: "ramesh@test.com", phone: "9876500001", services: ["PAN Card", "Income Tax Filing"] },
            { id: "c2", name: "Sita Devi", email: "sita@test.com", phone: "9876500002", services: ["Passport Application"] }
        ],
        payments: [
            { id: "p1", date: "2026-02-25T14:00:00Z", amount: 4200, description: "Commission Payout - Feb", status: "completed" },
            { id: "p2", date: "2026-01-25T10:00:00Z", amount: 3800, description: "Commission Payout - Jan", status: "completed" }
        ]
    },
    {
        id: "u003", name: "Rahul Verma", email: "rahul.kiosk@example.com", phone: "+91 9876123450", role: "kiosk", status: "blocked", join_date: "2025-08-11T09:15:00Z", transactions: 32,
        clients: [
            { id: "c3", name: "Amit Singh", email: "amit.s@test.com", phone: "9876500003", services: ["Driving License", "Voter ID"] }
        ],
        payments: [
            { id: "p3", date: "2026-02-10T09:00:00Z", amount: 1500, description: "Commission Payout - Mid Feb", status: "completed" }
        ]
    },
    { id: "u004", name: "John Doe", email: "john@example.com", phone: "+91 8899001122", role: "customer", status: "active", join_date: "2025-11-05T16:45:00Z", transactions: 5 },
    { id: "u005", name: "Sneha Gupta", email: "sneha@example.com", phone: "+91 7766554433", role: "customer", status: "active", join_date: "2026-01-10T11:20:00Z", transactions: 2 },
    { id: "u006", name: "Amit Patel", email: "amit@example.com", phone: "+91 9900990099", role: "customer", status: "active", join_date: "2026-02-01T08:00:00Z", transactions: 1 },
];

function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(dateStr));
}

/* ── Component ── */

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [viewUser, setViewUser] = useState<User | null>(null);
    const [viewClientsFor, setViewClientsFor] = useState<User | null>(null);
    const [viewPaymentsFor, setViewPaymentsFor] = useState<User | null>(null);
    const [addUserOpen, setAddUserOpen] = useState(false);

    const roles = [
        { id: "all", label: "All Users" },
        { id: "admin", label: "Admins" },
        { id: "kiosk", label: "Agents (Kiosks)" },
        { id: "customer", label: "Clients" },
    ];

    const filtered = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "all" || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleToggleStatus = (id: string, currentStatus: string) => {
        const newStatus = currentStatus === "active" ? "blocked" : "active";
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
        if (newStatus === "blocked") {
            toast.error("User blocked successfully.");
        } else {
            toast.success("User reactivated successfully.");
        }
    };

    const getRoleIcon = (role: string) => {
        if (role === "admin") return <Shield className="h-4 w-4 text-violet-600" />;
        if (role === "kiosk") return <Store className="h-4 w-4 text-emerald-600" />;
        return <UserCircle className="h-4 w-4 text-sky-600" />;
    };

    const getRoleBadge = (role: string) => {
        if (role === "admin") return <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">Admin</Badge>;
        if (role === "kiosk") return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Agent</Badge>;
        return <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200">Client</Badge>;
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <UsersIcon className="h-8 w-8 text-violet-600" />
                        User Management
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage admins, kiosk agents, and client accounts.
                    </p>
                </div>
                <Button onClick={() => setAddUserOpen(true)} className="bg-violet-600 hover:bg-violet-700 text-white">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add User
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-card rounded-xl border border-border p-4 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search by name, email, or ID..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 bg-background" />
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">{filtered.length} users</div>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                    {roles.map(r => (
                        <button
                            key={r.id}
                            onClick={() => setRoleFilter(r.id)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${roleFilter === r.id
                                ? "bg-violet-600 text-white"
                                : "bg-background text-foreground border border-border hover:bg-muted"
                                }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="hidden md:table-cell">Contact</TableHead>
                            <TableHead className="hidden lg:table-cell">Joined</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No users found.</TableCell>
                            </TableRow>
                        ) : (
                            filtered.map(user => (
                                <TableRow key={user.id} className="hover:bg-muted/30 transition-colors group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                                                {getRoleIcon(user.role)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.id.toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <p className="text-sm">{user.email}</p>
                                        <p className="text-xs text-muted-foreground">{user.phone}</p>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                                        {formatDate(user.join_date)}
                                    </TableCell>
                                    <TableCell>
                                        {user.status === "active" ? (
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Blocked</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => setViewUser(user)}>
                                                    <Eye className="mr-2 h-4 w-4 text-muted-foreground" /> View Details
                                                </DropdownMenuItem>
                                                {user.role === "kiosk" && (
                                                    <>
                                                        <DropdownMenuItem onClick={() => setViewClientsFor(user)}>
                                                            <UsersIcon className="mr-2 h-4 w-4 text-sky-600" /> View Clients
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setViewPaymentsFor(user)}>
                                                            <IndianRupee className="mr-2 h-4 w-4 text-emerald-600" /> Payment History
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                                <DropdownMenuSeparator />
                                                {user.role !== "admin" && (
                                                    <DropdownMenuItem
                                                        onClick={() => handleToggleStatus(user.id, user.status)}
                                                        className={user.status === "active" ? "text-red-600 focus:text-red-600 focus:bg-red-50" : "text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50"}
                                                    >
                                                        {user.status === "active" ? (
                                                            <><Ban className="mr-2 h-4 w-4" /> Block User</>
                                                        ) : (
                                                            <><CheckCircle className="mr-2 h-4 w-4" /> Reactivate</>
                                                        )}
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* View User Dialog */}
            <Dialog open={!!viewUser} onOpenChange={open => { if (!open) setViewUser(null); }}>
                <DialogContent className="sm:max-w-[425px]">
                    {viewUser && (
                        <>
                            <DialogHeader>
                                <DialogTitle>User Profile</DialogTitle>
                                <DialogDescription>Details for {viewUser.name}</DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center border-2 border-background shadow-sm">
                                        {getRoleIcon(viewUser.role)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">{viewUser.name}</h3>
                                        <p className="text-sm text-muted-foreground tracking-wide">{viewUser.id.toUpperCase()}</p>
                                    </div>
                                    <div className="ml-auto">
                                        {getRoleBadge(viewUser.role)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-muted/30 rounded-lg border border-border space-y-1">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</p>
                                        <p className="text-sm font-medium truncate" title={viewUser.email}>{viewUser.email}</p>
                                    </div>
                                    <div className="p-3 bg-muted/30 rounded-lg border border-border space-y-1">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</p>
                                        <p className="text-sm font-medium">{viewUser.phone}</p>
                                    </div>
                                    <div className="p-3 bg-muted/30 rounded-lg border border-border space-y-1">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Join Date</p>
                                        <p className="text-sm font-medium">{formatDate(viewUser.join_date)}</p>
                                    </div>
                                    <div className="p-3 bg-muted/30 rounded-lg border border-border space-y-1">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</p>
                                        <p className="text-sm font-medium capitalize flex items-center gap-2">
                                            {viewUser.status === "active" ? (
                                                <><span className="h-2 w-2 rounded-full bg-emerald-500"></span> Active</>
                                            ) : (
                                                <><span className="h-2 w-2 rounded-full bg-red-500"></span> Blocked</>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {viewUser.role !== "admin" && (
                                    <div className="flex items-center justify-between p-4 bg-violet-50 rounded-lg border border-violet-100">
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-semibold text-violet-900">Total Transactions</p>
                                            <p className="text-xs text-violet-700/80">Service requests processed</p>
                                        </div>
                                        <span className="text-2xl font-bold text-violet-600">{viewUser.transactions || 0}</span>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* View Clients Dialog */}
            <Dialog open={!!viewClientsFor} onOpenChange={open => { if (!open) setViewClientsFor(null); }}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Clients for Agent: {viewClientsFor?.name}</DialogTitle>
                        <DialogDescription>List of all clients registered through this Kiosk Agent.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 overflow-hidden border border-border rounded-xl mt-2">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead>Client Name</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Services Used</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {viewClientsFor?.clients && viewClientsFor.clients.length > 0 ? (
                                    viewClientsFor.clients.map(client => (
                                        <TableRow key={client.id}>
                                            <TableCell className="font-medium text-sm">{client.name}</TableCell>
                                            <TableCell>
                                                <p className="text-sm">{client.email}</p>
                                                <p className="text-xs text-muted-foreground">{client.phone}</p>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {client.services.map((svc, i) => (
                                                        <Badge key={i} variant="secondary" className="bg-violet-100 text-violet-700 whitespace-nowrap">
                                                            {svc}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">No clients found for this agent.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>

            {/* View Payments Dialog */}
            <Dialog open={!!viewPaymentsFor} onOpenChange={open => { if (!open) setViewPaymentsFor(null); }}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Payment History: {viewPaymentsFor?.name}</DialogTitle>
                        <DialogDescription>Recent commission payouts and wallet transactions.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 overflow-hidden border border-border rounded-xl mt-2">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {viewPaymentsFor?.payments && viewPaymentsFor.payments.length > 0 ? (
                                    viewPaymentsFor.payments.map(payment => (
                                        <TableRow key={payment.id}>
                                            <TableCell className="text-sm text-muted-foreground">{formatDate(payment.date)}</TableCell>
                                            <TableCell className="text-sm font-medium">{payment.description}</TableCell>
                                            <TableCell className="text-right font-semibold text-emerald-600">
                                                ₹{payment.amount.toLocaleString("en-IN")}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={payment.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}>
                                                    {payment.status === "completed" ? "Completed" : "Pending"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">No payment history found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add User Dialog */}
            <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>Create a new Admin or Kiosk Agent account.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <Input placeholder="Enter full name" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <Input type="email" placeholder="example@finfint.com" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone Number</label>
                            <Input placeholder="+91 0000000000" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Role</label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <option value="kiosk">Agent (Kiosk)</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddUserOpen(false)}>Cancel</Button>
                        <Button className="bg-violet-600 hover:bg-violet-700 text-white" onClick={() => {
                            toast.success("User created successfully!");
                            setAddUserOpen(false);
                        }}>Create User</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
