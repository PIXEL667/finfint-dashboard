"use client";

import { useState } from "react";
import {
    PackageOpen,
    Plus,
    Search,
    Pencil,
    Trash2,
    FileText,
    IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

interface Service {
    id: string;
    name: string;
    category: string;
    required_documents: string[];
    price: number;
    tax_percent: number;
    commission_rate: number;
}

const categories = ["Identity", "Tax", "Travel", "Transport", "Legal", "Insurance"];

const initialServices: Service[] = [
    { id: "s1", name: "PAN Card Application", category: "Identity", required_documents: ["ID Proof", "Address Proof", "Passport Photo"], price: 500, tax_percent: 18, commission_rate: 15 },
    { id: "s2", name: "Aadhaar Update", category: "Identity", required_documents: ["Old Aadhaar Copy", "Address Proof"], price: 200, tax_percent: 18, commission_rate: 12 },
    { id: "s3", name: "Passport Application", category: "Travel", required_documents: ["Old Passport Copy", "Address Proof", "ID Proof"], price: 1500, tax_percent: 18, commission_rate: 10 },
    { id: "s4", name: "Income Tax Filing", category: "Tax", required_documents: ["Form 16", "Bank Statement"], price: 999, tax_percent: 18, commission_rate: 18 },
    { id: "s5", name: "GST Registration", category: "Tax", required_documents: ["Business PAN", "Address Proof", "Bank Account Details"], price: 2000, tax_percent: 18, commission_rate: 15 },
    { id: "s6", name: "Driving License Renewal", category: "Transport", required_documents: ["Old License Copy", "Address Proof"], price: 600, tax_percent: 18, commission_rate: 12 },
];

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

/* ── Component ── */

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>(initialServices);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    // Form state
    const [form, setForm] = useState({ name: "", category: "", price: "", tax_percent: "18", commission_rate: "", docInput: "", documents: [] as string[] });

    const resetForm = () => setForm({ name: "", category: "", price: "", tax_percent: "18", commission_rate: "", docInput: "", documents: [] });

    const filtered = services.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddDoc = () => {
        if (form.docInput.trim() && !form.documents.includes(form.docInput.trim())) {
            setForm(f => ({ ...f, documents: [...f.documents, f.docInput.trim()], docInput: "" }));
        }
    };

    const handleRemoveDoc = (doc: string) => {
        setForm(f => ({ ...f, documents: f.documents.filter(d => d !== doc) }));
    };

    const handleCreate = () => {
        if (!form.name || !form.category || !form.price || !form.commission_rate || form.documents.length === 0) {
            toast.error("Please fill all fields and add at least one document.");
            return;
        }
        const newService: Service = {
            id: `s${Date.now()}`,
            name: form.name,
            category: form.category,
            required_documents: form.documents,
            price: Number(form.price),
            tax_percent: Number(form.tax_percent),
            commission_rate: Number(form.commission_rate),
        };
        setServices(prev => [...prev, newService]);
        toast.success(`Service "${form.name}" created successfully!`);
        setIsCreateOpen(false);
        resetForm();
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setForm({
            name: service.name,
            category: service.category,
            price: String(service.price),
            tax_percent: String(service.tax_percent),
            commission_rate: String(service.commission_rate),
            docInput: "",
            documents: [...service.required_documents],
        });
    };

    const handleUpdate = () => {
        if (!editingService || !form.name || !form.category || !form.price || !form.commission_rate) {
            toast.error("Please fill all fields.");
            return;
        }
        setServices(prev => prev.map(s => s.id === editingService.id ? {
            ...s,
            name: form.name,
            category: form.category,
            price: Number(form.price),
            tax_percent: Number(form.tax_percent),
            commission_rate: Number(form.commission_rate),
            required_documents: form.documents,
        } : s));
        toast.success(`Service "${form.name}" updated!`);
        setEditingService(null);
        resetForm();
    };

    const handleDelete = (id: string, name: string) => {
        setServices(prev => prev.filter(s => s.id !== id));
        toast.success(`Service "${name}" deleted.`);
    };

    const ServiceFormContent = () => (
        <div className="grid gap-4 py-4">
            <div className="space-y-2">
                <Label>Service Name</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g., PAN Card Application" />
            </div>
            <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                        {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="500" />
                </div>
                <div className="space-y-2">
                    <Label>Tax %</Label>
                    <Input type="number" value={form.tax_percent} onChange={e => setForm(f => ({ ...f, tax_percent: e.target.value }))} placeholder="18" />
                </div>
                <div className="space-y-2">
                    <Label>Commission %</Label>
                    <Input type="number" value={form.commission_rate} onChange={e => setForm(f => ({ ...f, commission_rate: e.target.value }))} placeholder="15" />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Required Documents</Label>
                <div className="flex gap-2">
                    <Input
                        value={form.docInput}
                        onChange={e => setForm(f => ({ ...f, docInput: e.target.value }))}
                        placeholder="e.g., ID Proof"
                        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddDoc(); } }}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={handleAddDoc}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {form.documents.map(doc => (
                        <Badge key={doc} variant="secondary" className="gap-1 pl-2.5 pr-1 py-1">
                            {doc}
                            <button onClick={() => handleRemoveDoc(doc)} className="ml-1 hover:text-red-500">
                                <Trash2 className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
                {form.documents.length === 0 && (
                    <p className="text-xs text-muted-foreground">Add required documents for this service</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <PackageOpen className="h-8 w-8 text-violet-600" />
                        Services Management
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Create and manage services with their documents, charges, and commission rates.
                    </p>
                </div>
                <Button onClick={() => { resetForm(); setIsCreateOpen(true); }} className="bg-violet-600 hover:bg-violet-700 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Service
                </Button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by name or category..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 bg-background" />
                </div>
                <div className="text-sm text-muted-foreground font-medium bg-muted/50 px-3 py-1.5 rounded-md border border-border">
                    {filtered.length} service{filtered.length !== 1 ? "s" : ""}
                </div>
            </div>

            {/* Services Table */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead>Service Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="hidden md:table-cell">Required Documents</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right hidden sm:table-cell">Commission</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No services found.</TableCell>
                            </TableRow>
                        ) : (
                            filtered.map(s => (
                                <TableRow key={s.id} className="hover:bg-muted/30 transition-colors group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                                                <FileText className="h-4 w-4 text-violet-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{s.name}</p>
                                                <p className="text-xs text-muted-foreground">{s.id.toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{s.category}</Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <div className="flex flex-wrap gap-1">
                                            {s.required_documents.map(d => (
                                                <span key={d} className="text-xs bg-muted px-2 py-0.5 rounded-md">{d}</span>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <IndianRupee className="h-3 w-3 text-muted-foreground" />
                                            <span className="font-semibold">{s.price}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">+{s.tax_percent}% tax</p>
                                    </TableCell>
                                    <TableCell className="text-right hidden sm:table-cell">
                                        <span className="font-semibold text-emerald-600">{s.commission_rate}%</span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(s)}>
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600" onClick={() => handleDelete(s.id, s.name)}>
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle>Create New Service</DialogTitle>
                        <DialogDescription>Set up a new service with required documents, charges, and commission rate.</DialogDescription>
                    </DialogHeader>
                    <ServiceFormContent />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate} className="bg-violet-600 hover:bg-violet-700 text-white">Create Service</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={!!editingService} onOpenChange={open => { if (!open) { setEditingService(null); resetForm(); } }}>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle>Edit Service</DialogTitle>
                        <DialogDescription>Update the service details, documents, and pricing.</DialogDescription>
                    </DialogHeader>
                    <ServiceFormContent />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setEditingService(null); resetForm(); }}>Cancel</Button>
                        <Button onClick={handleUpdate} className="bg-violet-600 hover:bg-violet-700 text-white">Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
