"use client";

import { useState } from "react";
import {
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    Pencil,
    Save,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

/* ── Inline mock data ── */

const mockServiceRequests = [
    { id: "sr001", status: "in_progress" },
    { id: "sr002", status: "completed" },
    { id: "sr003", status: "pending" },
    { id: "sr004", status: "completed" },
    { id: "sr005", status: "in_progress" },
];

/* ── Component ── */

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);

    // Profile form state
    const [profile, setProfile] = useState({
        fullName: "John Doe",
        email: "user@example.com",
        phone: "+91 98765 43210",
        address: "123 Main St, Springfield, IL 62701",
    });

    const [editForm, setEditForm] = useState(profile);

    const userRequests = mockServiceRequests;

    const stats = {
        total: userRequests.length,
        completed: userRequests.filter(r => r.status === "completed").length,
        inProgress: userRequests.filter(r => r.status === "in_progress").length,
        pending: userRequests.filter(r => r.status === "pending").length,
    };

    const handleEdit = () => {
        setEditForm(profile);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditForm(profile);
        setIsEditing(false);
    };

    const handleSave = () => {
        // Validate
        if (!editForm.fullName.trim()) {
            toast.error("Validation Error: Full name is required.");
            return;
        }
        if (!editForm.email.trim() || !editForm.email.includes("@")) {
            toast.error("Validation Error: Please enter a valid email address.");
            return;
        }
        if (!editForm.phone.trim()) {
            toast.error("Validation Error: Phone number is required.");
            return;
        }

        setProfile(editForm);
        setIsEditing(false);
        toast.success("Profile updated! Your personal information has been saved successfully.");
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    My Profile
                </h1>
                <p className="text-muted-foreground mt-1">
                    View and manage your account information
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
                <div className="bg-card rounded-xl p-4 shadow-sm border border-border border-l-4 border-l-primary flex flex-col justify-between h-24">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm font-medium">Total Requests</span>
                    </div>
                    <span className="text-2xl font-bold text-primary">{stats.total}</span>
                </div>

                <div className="bg-card rounded-xl p-4 shadow-sm border border-border border-l-4 border-l-accent flex flex-col justify-between h-24">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Completed</span>
                    </div>
                    <span className="text-2xl font-bold text-accent">{stats.completed}</span>
                </div>

                <div className="bg-card rounded-xl p-4 shadow-sm border border-border border-l-4 border-l-primary/60 flex flex-col justify-between h-24">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">In Progress</span>
                    </div>
                    <span className="text-2xl font-bold text-primary/80">{stats.inProgress}</span>
                </div>

                <div className="bg-card rounded-xl p-4 shadow-sm border border-border border-l-4 border-l-yellow-500 flex flex-col justify-between h-24">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Pending</span>
                    </div>
                    <span className="text-2xl font-bold text-yellow-500">{stats.pending}</span>
                </div>
            </div>

            {/* Personal Information */}
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Personal Information</h2>
                        <p className="text-sm text-muted-foreground">Manage your profile details</p>
                    </div>
                    {!isEditing && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEdit}
                            className="gap-2"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit Profile
                        </Button>
                    )}
                </div>

                {isEditing ? (
                    /* Edit Mode */
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Full Name</label>
                                <Input
                                    value={editForm.fullName}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Email</label>
                                <Input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Phone</label>
                                <Input
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                                    placeholder="Enter your phone"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Member Since</label>
                                <Input value="15 Jan 2024" disabled className="bg-muted/30" />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Address</label>
                                <Input
                                    value={editForm.address}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                                    placeholder="Enter your address"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                            <Button
                                onClick={handleSave}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                            >
                                <Save className="h-4 w-4" />
                                Save Changes
                            </Button>
                            <Button variant="outline" onClick={handleCancel} className="gap-2">
                                <X className="h-4 w-4" />
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    /* View Mode */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                        <div className="space-y-1">
                            <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Full Name</p>
                            <p className="font-medium text-foreground">{profile.fullName}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Email</p>
                            <p className="font-medium text-foreground">{profile.email}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Phone</p>
                            <p className="font-medium text-foreground">{profile.phone}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Member Since</p>
                            <p className="font-medium text-foreground">15 Jan 2024</p>
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-1">
                            <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Address</p>
                            <p className="font-medium text-foreground">{profile.address}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Account Information */}
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
                <div>
                    <h2 className="text-xl font-bold">Account Information</h2>
                    <p className="text-sm text-muted-foreground">Your account details and preferences</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-4 rounded-lg border border-border">
                        <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-1">Account Type</p>
                        <p className="font-medium">Standard User</p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg border border-border">
                        <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-1">Account Status</p>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="font-medium text-emerald-600 text-sm">Active</span>
                        </div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg border border-border">
                        <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-1">KYC Status</p>
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            <span className="font-medium text-emerald-600 text-sm">Verified</span>
                        </div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg border border-border">
                        <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-1">Last Updated</p>
                        <p className="font-medium">24 Feb 2026</p>
                    </div>
                </div>
            </div>

            {/* Security Note */}
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-4 border-l-4 border-l-yellow-500">
                <h3 className="text-lg font-bold">Security & Privacy</h3>
                <div className="space-y-4 text-sm text-foreground/80">
                    <p>Your account is protected with secure authentication. Never share your password or personal information with anyone.</p>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        <li>All data is encrypted and securely stored</li>
                        <li>Your information is private and never shared with third parties</li>
                        <li>You can update your profile information at any time</li>
                        <li>For security concerns, please contact support</li>
                    </ul>
                </div>
            </div>

            <div className="h-8"></div>
        </div>
    );
}
