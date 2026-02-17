"use client";

import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully");
            router.push("/login");
            router.refresh();
          },
        },
      });
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <DropdownMenuItem 
      onClick={handleLogout}
      className="p-2.5 cursor-pointer gap-3 rounded-xl focus:bg-red-50 text-red-500 font-semibold transition-colors"
    >
      <LogOut className="size-4" /> Sign Out
    </DropdownMenuItem>
  );
}