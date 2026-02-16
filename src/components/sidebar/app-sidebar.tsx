"use client";

import * as React from "react";
import { DASHBOARD_ROUTES } from "@/routes/admin.routes";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Newspaper, LogOut } from "lucide-react";
import { userService } from "@/services/user.service";

export function AppSidebar() {
    const pathname = usePathname();
    const [role, setRole] = React.useState<"ADMIN" | "USER" | null>(null);

    React.useEffect(() => {
        const fetchUserRole = async () => {
            const { data } = await userService.getSession();
            setRole(data?.user?.role as "ADMIN" | "USER");
        };
        fetchUserRole();
    }, []);

    const menuItems = role ? DASHBOARD_ROUTES[role] : [];

    return (
        <Sidebar variant="inset" collapsible="icon">
            <SidebarHeader className="p-4">
                <Link href="/" className="flex items-center gap-2 font-black text-red-600">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white">
                        <Newspaper size={20} />
                    </div>
                    <span className="text-xl tracking-tighter group-data-[collapsible=icon]:hidden text-red-600">
                        NEWS<span className="text-gray-900">PRESS</span>
                    </span>
                </Link>
            </SidebarHeader>

            <SidebarContent>
                {menuItems.map((group) => (
                    <SidebarGroup key={group.group}>
                        <SidebarGroupLabel className="text-[10px] uppercase font-bold text-gray-400">
                            {group.group}
                        </SidebarGroupLabel>
                        <SidebarMenu>
                            {group.items.map((item) => {
                                const isActive = pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                            className={isActive ? "bg-red-50 text-red-600 font-semibold" : ""}
                                        >
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter className="p-4 border-t">
                <SidebarMenuButton className="text-red-600 hover:bg-red-50 font-bold">
                    <LogOut size={18} />
                    <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                </SidebarMenuButton>
            </SidebarFooter>
        </Sidebar>
    );
}