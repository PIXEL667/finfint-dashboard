"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    FilePlus,
    ArrowLeft,
    Info,
    CheckCircle2
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
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Group services by category for the select dropdown
    const groupedServices = mockServices.reduce((acc, service) => {
        if (!acc[service.category_name]) {
            acc[service.category_name] = [];
        }
        acc[service.category_name].push(service);
        return acc;
    }, {} as Record<string, typeof mockServices>);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            toast.success("Request created! Your service request has been submitted successfully.");
            router.push("/dashboard/client/request");
        }, 1000);
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div>
                <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2 text-muted-foreground hover:text-foreground">
                    <Link href="/dashboard/client/request">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to requests
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Create Service Request
                </h1>
                <p className="text-muted-foreground mt-1">
                    Submit a new service request without visiting a kiosk
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-border bg-muted/20">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <FilePlus className="h-5 w-5 text-primary" />
                                Create New Service Request
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Fill out the form to create a new service request
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="space-y-3">
                                <Label htmlFor="title" className="text-base">Request Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., Renew Driver License"
                                    required
                                    className="bg-background"
                                />
                                <p className="text-xs text-muted-foreground">A brief title for your request</p>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="service-type" className="text-base">Service Type</Label>
                                <Select required>
                                    <SelectTrigger className="bg-background">
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
                                <p className="text-xs text-muted-foreground">Choose the type of service you need</p>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="description" className="text-base">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Provide a detailed description of your request..."
                                    className="min-h-[150px] bg-background resize-y"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Include any relevant details that will help us process your request</p>
                            </div>

                            <div className="pt-4 flex items-center gap-4">
                                <Button
                                    type="submit"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[150px]"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Creating..." : "Create Request"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    asChild
                                >
                                    <Link href="/dashboard/client/request">Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-[#f0f7fa] rounded-xl border border-blue-200 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Info className="h-5 w-5 text-primary" />
                            <h3 className="font-bold text-lg text-primary">What happens next?</h3>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "Your request will be created with a unique request ID",
                                "You can upload required documents immediately",
                                "Payment can be made online from your request details",
                                "You'll receive updates on the status of your request"
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
