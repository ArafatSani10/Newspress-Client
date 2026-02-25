/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LogoutButton } from "@/components/dashboardlayouts/LogoutButton";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { authClient } from "@/lib/auth-client";
import { Bell, Loader2, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function DashboardLayout({
  admin,
  user,
}: {
  admin: React.ReactNode;
  user: React.ReactNode;
}) {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    authClient.getSession().then(({ data, error }) => {
      if (error || !data?.user) {
        router.replace("/login");
      } else {
        setUserInfo(data.user);
      }
      setLoading(false);
    });
  }, [router]);

  const getDashboardTitle = () => {
    return userInfo?.role === "ADMIN" ? "Admin Panel" : "User Dashboard";
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="size-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#FAFAFA]">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between px-6 bg-white border-b border-zinc-200">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-zinc-500" />
            <div className="h-5 w-[1px] bg-zinc-200" />
            <h2 className="text-sm font-bold text-zinc-600 uppercase ">
              {getDashboardTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-zinc-100 text-zinc-500 transition-colors">
              <Bell className="size-5" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger
                className="outline-none focus:outline-none"
                asChild
              >
                <button className="size-9 rounded-full bg-zinc-100 overflow-hidden relative border border-zinc-200 cursor-pointer outline-none">
                  {userInfo?.image ? (
                    <Image
                      src={userInfo.image}
                      alt="user"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs font-bold text-zinc-500">
                      {userInfo?.name?.charAt(0) || "U"}
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 mt-2 rounded-md border-zinc-200 shadow-none"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold leading-none text-zinc-900">
                      {userInfo?.name}
                    </p>
                    <p className="text-[10px] leading-none text-zinc-500 uppercase font-bold tracking-tighter italic">
                      {userInfo?.email}
                    </p>
                    <p className="text-[10px] leading-none text-zinc-400 uppercase font-bold tracking-tighter">
                      Role: {userInfo?.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer gap-2 focus:bg-zinc-100 rounded-sm">
                  <UserIcon className="size-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <LogoutButton />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="p-8 min-h-[calc(100vh-64px)]">
          {userInfo?.role === "ADMIN" ? admin : user}
        </main>

        <Toaster richColors position="top-right" closeButton />
      </SidebarInset>
    </SidebarProvider>
  );
}
