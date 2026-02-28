"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    FilePlus,
    ArrowLeft,
    Info,
    CheckCircle2,
    UserCircle
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

/* ── Inline mock data ── */

const mockServices = [
    { id: "s1", name: "PAN Card Application", category_name: "Identity" },
    { id: "s2", name: "Aadhaar Update", category_name: "Identity" },
    { id: "s3", name: "Passport Application", category_name: "Travel" },
    { id: "s4", name: "Income Tax Filing", category_name: "Tax" },
    { id: "s5", name: "GST Registration", category_name: "Tax" },
    { id: "s6", name: "Driving License Renewal", category_name: "Transport" },
];

/* ── Component ── */

export default function CreateRequestPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form Data State
    const [clientData, setClientData] = useState({
        name: "",
        phone: "",
        email: ""
    });

    // Step 2 State
    const [isVerified, setIsVerified] = useState(false);
    const [clientNeeds, setClientNeeds] = useState("");

    // Step 3 State
    const [serviceData, setServiceData] = useState({
        title: "",
        serviceId: "",
        description: ""
    });

    // Group services by category for the select dropdown
    const groupedServices = mockServices.reduce((acc, service) => {
        if (!acc[service.category_name]) {
            acc[service.category_name] = [];
        }
        acc[service.category_name].push(service);
        return acc;
    }, {} as Record<string, typeof mockServices>);

    // Handlers
    const handleNext = () => setStep(s => Math.min(s + 1, 3));
    const handleBack = () => setStep(s => Math.max(s - 1, 1));

    const handleVerificationTrigger = () => {
        setIsVerified(true);
        toast.info(`Client authentication verified for ${clientData.name}`);
    };

    const handleSaveNeeds = () => {
        if (clientNeeds.length >= 10) {
            toast.success("Client needs documented successfully!");
            handleNext();
        } else {
            toast.error("Please provide a more detailed description of the client's needs.");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            toast.success("Request submitted! It is now Pending Admin Approval.", {
                description: "You'll be notified once approved so you can gather details and pay the fee."
            });
            router.push("/dashboard/kiosk/request");
        }, 1000);
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div>
                <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2 text-muted-foreground hover:text-foreground">
                    <Link href="/dashboard/kiosk/request">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to requests
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Create Service Request
                </h1>
                <p className="text-muted-foreground mt-1">
                    Complete the steps below to file a new service request for a client
                </p>
            </div>

            {/* Progress Stepper */}
            <div className="flex items-center justify-between max-w-2xl px-4 py-4 bg-card rounded-xl border border-border">
                {[
                    { num: 1, label: "Client Details" },
                    { num: 2, label: "Verification" },
                    { num: 3, label: "Service Request" }
                ].map((s, idx) => (
                    <div key={s.num} className="flex flex-col items-center gap-2 flex-1 relative">
                        {/* Connecting Line */}
                        {idx !== 2 && (
                            <div className={`absolute top-4 left-1/2 w-full h-[2px] -z-10 ${step > s.num ? "bg-primary" : "bg-muted"}`} />
                        )}
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border-2
                            ${step === s.num ? "border-primary bg-primary/10 text-primary" :
                                step > s.num ? "border-primary bg-primary text-primary-foreground" :
                                    "border-muted bg-muted text-muted-foreground"}`}
                        >
                            {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                        </div>
                        <span className={`text-xs font-semibold ${step >= s.num ? "text-primary" : "text-muted-foreground"}`}>
                            {s.label}
                        </span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden min-h-[400px]">

                        {/* Step 1: Client Details */}
                        {step === 1 && (
                            <div className="p-6">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <UserCircle className="h-5 w-5 text-primary" />
                                    Step 1: Client Information
                                </h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="client-name">Full Name</Label>
                                        <Input
                                            id="client-name"
                                            value={clientData.name}
                                            onChange={e => setClientData({ ...clientData, name: e.target.value })}
                                            placeholder="Enter client's full name"
                                            className="bg-background"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="client-phone">Phone Number</Label>
                                            <Input
                                                id="client-phone"
                                                value={clientData.phone}
                                                onChange={e => setClientData({ ...clientData, phone: e.target.value })}
                                                placeholder="Enter phone number"
                                                className="bg-background"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="client-email">Email Address</Label>
                                            <Input
                                                id="client-email"
                                                type="email"
                                                value={clientData.email}
                                                onChange={e => setClientData({ ...clientData, email: e.target.value })}
                                                placeholder="Enter email address"
                                                className="bg-background"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <Button
                                        onClick={handleNext}
                                        disabled={!clientData.name || !clientData.phone}
                                    >
                                        Continue to Verification
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Verification & Requirements */}
                        {step === 2 && (
                            <div className="p-6">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                    Step 2: Client Verification & Needs
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    Verify the client's information and capture a comprehensive summary of how they need help (Reference: mrfinfit.in service requirements).
                                </p>

                                <div className="space-y-6">
                                    <div className="p-4 bg-muted/50 rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium">Verifying: {clientData.name}</p>
                                            <p className="text-xs text-muted-foreground">{clientData.phone}</p>
                                        </div>
                                        <Badge variant={isVerified ? "default" : "secondary"} className={isVerified ? "bg-emerald-100 text-emerald-800" : ""}>
                                            {isVerified ? "Verified" : "Pending Verification"}
                                        </Badge>
                                    </div>

                                    {!isVerified ? (
                                        <div className="space-y-4 max-w-sm mx-auto text-center border p-4 rounded-xl border-border">
                                            <p className="text-sm">We need to quickly verify this client before proceeding.</p>
                                            <Button onClick={handleVerificationTrigger} className="w-full">
                                                Verify via OTP / Biometric
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="client-needs" className="text-base text-primary font-semibold">
                                                    Comprehensive Client Needs Assessment
                                                </Label>
                                                <p className="text-xs text-muted-foreground mb-2">
                                                    Detail everything the client requires based on the MrFinFit service checklist. This helps expedite the service request process.
                                                </p>
                                                <Textarea
                                                    id="client-needs"
                                                    value={clientNeeds}
                                                    onChange={e => setClientNeeds(e.target.value)}
                                                    placeholder="e.g., Client needs to update address on Aadhaar and link it to PAN. They have brought their electricity bill and voter ID for proof of new address..."
                                                    className="min-h-[120px] resize-y bg-background"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 flex justify-between">
                                    <Button variant="outline" onClick={handleBack}>
                                        Back to Details
                                    </Button>
                                    <Button onClick={handleSaveNeeds} disabled={!isVerified || clientNeeds.length < 10}>
                                        Save Needs & Continue
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Service Request Form */}
                        {step === 3 && (
                            <form onSubmit={handleSubmit} className="p-6 flex flex-col h-full">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <FilePlus className="h-5 w-5 text-primary" />
                                    Step 3: Service Details
                                </h2>

                                <div className="space-y-4 flex-1">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Request Title</Label>
                                        <Input
                                            id="title"
                                            value={serviceData.title}
                                            onChange={e => setServiceData({ ...serviceData, title: e.target.value })}
                                            placeholder="e.g., Renew Driver License"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="service-type">Service Type</Label>
                                        <Select
                                            required
                                            value={serviceData.serviceId}
                                            onValueChange={val => setServiceData({ ...serviceData, serviceId: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a service type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(groupedServices).map(([category, services]) => (
                                                    <div key={category}>
                                                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50">
                                                            {category}
                                                        </div>
                                                        {services.map(service => (
                                                            <SelectItem key={service.id} value={service.id}>
                                                                {service.name}
                                                            </SelectItem>
                                                        ))}
                                                    </div>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={serviceData.description}
                                            onChange={e => setServiceData({ ...serviceData, description: e.target.value })}
                                            placeholder="Provide a detailed description of your request..."
                                            className="min-h-[120px] resize-y"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-between">
                                    <Button type="button" variant="outline" onClick={handleBack}>
                                        Back to Verification
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="min-w-[150px]"
                                        disabled={isSubmitting || !serviceData.title || !serviceData.serviceId}
                                    >
                                        {isSubmitting ? "Creating..." : "Submit Request"}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-[#f0f7fa] rounded-xl border border-blue-200 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Info className="h-5 w-5 text-primary" />
                            <h3 className="font-bold text-lg text-primary">Kiosk Workflow</h3>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "Enter exact client details",
                                "Verify client via OTP/Bio",
                                "Select the service they require",
                                "Document uploads/payment on next step"
                            ].map((text, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <span className="text-sm text-slate-700 leading-snug">{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
