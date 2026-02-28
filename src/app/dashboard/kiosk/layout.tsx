"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    FilePlus2,
    UserCircle,
    Users,
    Wallet,
    LogOut,
    ChevronRight,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
    SidebarSeparator,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const navItems = [
    { title: "Dashboard", href: "/dashboard/kiosk", icon: LayoutDashboard, exact: true },
    { title: "My Clients", href: "/dashboard/kiosk/clients", icon: Users, exact: true },
    { title: "My Requests", href: "/dashboard/kiosk/request", icon: FileText, exact: true },
    { title: "New Request", href: "/dashboard/kiosk/request/new", icon: FilePlus2 },
    { title: "Wallet", href: "/dashboard/kiosk/wallet", icon: Wallet },
    { title: "Profile", href: "/dashboard/kiosk/profile", icon: UserCircle },
];

function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon" className="border-r border-border/40">
            {/* Brand header */}
            <SidebarHeader className="p-4 pb-3">
                <Link href="/dashboard/kiosk" className="flex items-center gap-3 min-h-8">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                        FP
                    </div>
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                        <span className="text-sm font-bold tracking-tight leading-tight">Service Portal</span>
                        <span className="text-xs text-muted-foreground leading-tight">FinFit Platform</span>
                    </div>
                </Link>
            </SidebarHeader>

            <SidebarSeparator />

            {/* Main navigation */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs text-muted-foreground/70 uppercase tracking-widest font-semibold px-3">
                        Menu
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-0.5 px-2">
                            {navItems.map((item) => {
                                const isActive = item.exact
                                    ? pathname === item.href
                                    : pathname === item.href || (item.href !== "/dashboard/kiosk" && pathname.startsWith(item.href));
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                            className={`h-10 rounded-lg transition-all duration-200 ${isActive
                                                ? "bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90 hover:text-primary-foreground"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                }`}
                                        >
                                            <Link href={item.href}>
                                                <item.icon className="size-4" />
                                                <span>{item.title}</span>
                                                {isActive && (
                                                    <ChevronRight className="ml-auto size-3 opacity-60 group-data-[collapsible=icon]:hidden" />
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer with user and logout */}
            <SidebarFooter className="p-3 pt-0">
                <SidebarSeparator className="mb-3" />

                {/* User info */}
                <div className="flex items-center gap-3 px-2 mb-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
                        JD
                    </div>
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                        <span className="text-sm font-medium leading-tight">John Doe</span>
                        <span className="text-xs text-muted-foreground leading-tight">user@example.com</span>
                    </div>
                </div>

                {/* Logout — subtle, not aggressive */}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip="Sign out"
                            className="h-9 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors rounded-lg"
                        >
                            <button className="w-full">
                                <LogOut className="size-4" />
                                <span>Sign out</span>
                            </button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset className="bg-[#f4f7fa]">
                {/* Minimal top bar */}
                <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border/40 bg-background/80 backdrop-blur-sm px-4 sticky top-0 z-10 w-full">
                    <div className="flex items-center gap-2 flex-1">
                        <SidebarTrigger className="-ml-1 size-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors" />
                        <Separator orientation="vertical" className="h-4 mx-1" />
                        <nav className="hidden sm:flex items-center text-sm text-muted-foreground">
                            <span className="font-medium">Service Portal</span>
                        </nav>
                    </div>

                    {/* Wallet Balance Display */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full border border-primary/20 shrink-0">
                        <Wallet className="h-4 w-4" />
                        <span className="text-sm font-bold truncate">
                            ₹34,071.18
                        </span>
                    </div>
                </header>
                <main className="flex-1 w-full min-h-[calc(100vh-3rem)] p-4 sm:p-6 overflow-x-hidden">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
