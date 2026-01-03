"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    useSidebar,
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { UserRole } from "@/lib/types";
import { SyncQueue } from "./sync-queue";

// Define allowed roles for each module
const NAV_CONFIG: {
    title: string;
    url: string;
    icon: any;
    roles: UserRole[]
}[] = [
        {
            title: "Dashboards",
            url: "/dashboard",
            icon: Icons.reports,
            roles: ["super_admin", "sales_manager", "senior_sales_rep", "finance_user", "service_engineer", "customer"]
        },
        {
            title: "Leads & Sales",
            url: "/leads",
            icon: Icons.leads,
            roles: ["super_admin", "sales_manager", "senior_sales_rep"]
        },
        {
            title: "Visits & Check-ins",
            url: "/visits",
            icon: Icons.location,
            roles: ["super_admin", "sales_manager", "senior_sales_rep", "service_engineer"]
        },
        {
            title: "Approvals",
            url: "/approvals",
            icon: Icons.check,
            roles: ["super_admin", "sales_manager"]
        },
        {
            title: "Quotes",
            url: "/quotes",
            icon: Icons.quotes,
            roles: ["super_admin", "sales_manager", "senior_sales_rep", "customer"]
        },
        {
            title: "Accounting",
            url: "/accounting",
            icon: Icons.accounting,
            roles: ["super_admin", "finance_user", "customer"]
        },
        {
            title: "Financial Statement",
            url: "/accounting/statement",
            icon: Icons.reports,
            roles: ["super_admin", "finance_user", "customer"]
        },
        {
            title: "Machines",
            url: "/machines",
            icon: Icons.logo,
            roles: ["super_admin", "sales_manager", "service_engineer", "customer", "senior_sales_rep"]
        },
        {
            title: "Service",
            url: "/service",
            icon: Icons.service,
            roles: ["super_admin", "sales_manager", "service_engineer", "customer", "senior_sales_rep"]
        },
        {
            title: "Catalog",
            url: "/catalog",
            icon: Icons.admin,
            roles: ["super_admin"]
        },
        {
            title: "GST Reports",
            url: "/reports",
            icon: Icons.reports,
            roles: ["super_admin", "finance_user"]
        },
        {
            title: "Settings",
            url: "/settings",
            icon: Icons.settings,
            roles: ["super_admin", "sales_manager", "finance_user", "service_engineer", "customer"]
        },
        {
            title: "User Management",
            url: "/admin/users",
            icon: Icons.menu,
            roles: ["super_admin"]
        },
        {
            title: "Audit Logs",
            url: "/audit",
            icon: Icons.reports,
            roles: ["super_admin"]
        },
    ];

export function AppSidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { setOpenMobile, isMobile } = useSidebar();

    // Filter items based on user role
    const filteredNav = NAV_CONFIG.filter(item =>
        user?.role && item.roles.includes(user.role)
    );

    if (!user) return null; // Or return simplified sidebar logic for guests?

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="h-14 flex items-center justify-between px-4 border-b">
                <div className="flex items-center gap-2 font-bold text-lg text-primary overflow-hidden">
                    <Icons.logo className="h-6 w-6 flex-shrink-0" />
                    <span className="truncate">Lotus Digital</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredNav.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        isActive={pathname.startsWith(item.url)}
                                        onClick={() => isMobile && setOpenMobile(false)}
                                    >
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t p-4">
                <div className="flex items-center gap-3 overflow-hidden mb-2">
                    <Avatar className="h-9 w-9 border">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}`} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col truncate">
                        <span className="text-sm font-medium truncate">{user.name}</span>
                        <span className="text-xs text-muted-foreground truncate capitalize">{user.role?.replace(/_/g, " ")}</span>
                    </div>
                </div>
                {(user?.role === 'service_engineer' || user?.role === 'senior_sales_rep') && (
                    <div className="mb-4">
                        <SyncQueue />
                    </div>
                )}
                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={logout}>
                    <Icons.logout className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}
