"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Users, Search, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";

import { mockClients, formatDate } from "../data";

export default function ClientsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredClients = mockClients.filter((client) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone.includes(searchQuery)
    );

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header section with title and actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Users className="h-8 w-8 text-primary" />
                        My Clients
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your clients and quickly start new service requests for them.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Link href="/dashboard/kiosk/request/new">
                            <Plus className="mr-2 h-4 w-4" />
                            New Client Request
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Filter / Search Bar */}
            <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, email, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-background"
                    />
                </div>
                <div className="text-sm text-muted-foreground font-medium bg-muted/50 px-3 py-1.5 rounded-md border border-border">
                    {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''} found
                </div>
            </div>

            {/* The Table */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead className="w-[200px]">Client Name</TableHead>
                            <TableHead>Contact Info</TableHead>
                            <TableHead className="text-center">Total Requests</TableHead>
                            <TableHead className="hidden md:table-cell">Added On</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredClients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <Users className="h-8 w-8 opacity-20" />
                                        <p>No clients found matching your search.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredClients.map((client) => (
                                <TableRow key={client.id} className="hover:bg-muted/50 transition-colors group">
                                    <TableCell className="font-medium">
                                        {client.name}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col space-y-1">
                                            <span className="text-sm px-2 py-0.5 rounded-md bg-muted text-foreground w-fit">{client.phone}</span>
                                            <span className="text-xs text-muted-foreground">{client.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary" className="font-semibold">
                                            {client.total_requests}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                                        {formatDate(client.created_at)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[180px]">
                                                <DropdownMenuLabel>Client Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild className="cursor-pointer">
                                                    {/* Pass query params to pre-fill the form */}
                                                    <Link href={`/dashboard/kiosk/request/new?clientId=${client.id}&name=${encodeURIComponent(client.name)}&phone=${encodeURIComponent(client.phone)}&email=${encodeURIComponent(client.email)}`}>
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Start New Request
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem disabled>
                                                    View History
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
