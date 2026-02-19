"use client";

import React, { useEffect, useState } from "react";
import { 
    ShieldCheck, 
    User, 
    Mail, 
    MoreVertical, 
    Trash2, 
    Search,
    RefreshCw,
    UserCheck
} from "lucide-react";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { userService } from "@/services/user.service";

export default function AllUser() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        setIsLoading(true);
        const result = await userService.getAll();
        if (result.success) {
            setUsers(result.data);
        } else {
            toast.error(result.message || "Failed to fetch users");
        }
        setIsLoading(false);
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        const result = await userService.updateRole(userId, newRole);
        if (result.success) {
            toast.success(`User role updated to ${newRole}`);
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } else {
            toast.error(result.message || "Failed to update role");
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-white font-sans max-w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
                <div className="flex items-center gap-2">
                    <div className="bg-zinc-900 p-1.5 rounded-sm">
                        <UserCheck size={18} className="text-white" />
                    </div>
                    <h1 className="text-lg font-semibold text-zinc-900 leading-none">Access Control</h1>
                </div>
                
            </div>

            <div className="px-6 py-3 border-b border-zinc-100 bg-zinc-50/50">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-9 h-9 rounded-sm border-zinc-200 bg-white text-sm focus:ring-0 focus:border-zinc-400 placeholder:text-zinc-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <Table>
                    <TableHeader className="bg-zinc-50 sticky top-0 z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                        <TableRow className="border-b border-zinc-200 hover:bg-transparent">
                            <TableHead className="h-10 text-[11px] font-bold text-zinc-500 ">Name</TableHead>
                            <TableHead className="h-10 text-[11px] font-bold text-zinc-500 ">Email Address</TableHead>
                            <TableHead className="h-10 text-[11px] font-bold text-zinc-500 ">Role Assignment</TableHead>
                            <TableHead className="h-10 text-[11px] font-bold text-zinc-500 ">Registered</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i} className="animate-pulse">
                                    <TableCell colSpan={5} className="py-4 border-b border-zinc-100">
                                        <div className="h-4 bg-zinc-100 rounded-sm w-full"></div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} className="border-b border-zinc-100 hover:bg-zinc-50/40 transition-none group">
                                    <TableCell className="py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-zinc-900 flex items-center justify-center text-white font-bold text-[10px] shrink-0 uppercase shadow-sm">
                                                {user.name[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-zinc-800 leading-tight">{user.name}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-zinc-600">
                                            <Mail size={12} className="text-zinc-400" />
                                            <span className="text-xs font-medium">{user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Select 
                                            defaultValue={user.role} 
                                            onValueChange={(value) => handleRoleChange(user.id, value)}
                                        >
                                            <SelectTrigger className="h-8 w-[100px] rounded-sm text-[10px] font-bold border-zinc-200 bg-white focus:ring-0">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-sm border-zinc-200 shadow-xl min-w-[100px]">
                                                <SelectItem value="USER" className="text-xs font-semibold">USER</SelectItem>
                                                <SelectItem value="ADMIN" className="text-xs font-semibold text-red-600">ADMIN</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs font-semibold text-zinc-500">
                                            {new Date(user.createdAt).toLocaleDateString("en-GB")}
                                        </span>
                                    </TableCell>
                                    
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-20 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                    No users found matching your search
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}