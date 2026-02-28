"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    PackageOpen,
    FileText,
    Wallet,
    LogOut,
    ChevronRight,
    ShieldCheck,
    Users,
    IndianRupee,
    History,
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
    { title: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard, exact: true },
    { title: "Users", href: "/dashboard/admin/users", icon: Users },
    { title: "Services", href: "/dashboard/admin/services", icon: PackageOpen },
    { title: "Requests", href: "/dashboard/admin/requests", icon: FileText },
    { title: "Payment History", href: "/dashboard/admin/payments", icon: IndianRupee },
    { title: "Logs", href: "/dashboard/admin/logs", icon: History },
];

function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon" className="border-r border-border/40">
            <SidebarHeader className="p-4 pb-3">
                <Link href="/dashboard/admin" className="flex items-center gap-3 min-h-8">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-violet-600 to-indigo-600 text-white font-bold text-sm">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                        <span className="text-sm font-bold tracking-tight leading-tight">Admin Panel</span>
                        <span className="text-xs text-muted-foreground leading-tight">FinFint Platform</span>
                    </div>
                </Link>
            </SidebarHeader>

            <SidebarSeparator />

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs text-muted-foreground/70 uppercase tracking-widest font-semibold px-3">
                        Management
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-0.5 px-2">
                            {navItems.map((item) => {
                                const isActive = item.exact
                                    ? pathname === item.href
                                    : pathname === item.href || pathname.startsWith(item.href);
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                            className={`h-10 rounded-lg transition-all duration-200 ${isActive
                                                ? "bg-violet-600 text-white font-semibold shadow-sm hover:bg-violet-700 hover:text-white"
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

            <SidebarFooter className="p-3 pt-0">
                <SidebarSeparator className="mb-3" />
                <div className="flex items-center gap-3 px-2 mb-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold">
                        AD
                    </div>
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                        <span className="text-sm font-medium leading-tight">Admin User</span>
                        <span className="text-xs text-muted-foreground leading-tight">admin@finfint.com</span>
                    </div>
                </div>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip="Sign out"
                            className="h-9 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors rounded-lg"
                        >
                            <Link href="/">
                                <LogOut className="size-4" />
                                <span>Sign out</span>
                            </Link>
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
                <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border/40 bg-background/80 backdrop-blur-sm px-4 sticky top-0 z-10">
                    <SidebarTrigger className="-ml-1 size-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors" />
                    <Separator orientation="vertical" className="h-4 mx-1" />
                    <nav className="flex items-center text-sm text-muted-foreground">
                        <span className="font-medium">Admin Panel</span>
                    </nav>
                </header>
                <main className="flex-1 w-full min-h-[calc(100vh-3rem)] p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
