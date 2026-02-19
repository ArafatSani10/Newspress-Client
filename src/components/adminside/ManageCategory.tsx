"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
    Tags, Search, Edit2, Trash2, Check, X, RefreshCw, Layers 
} from "lucide-react";
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { categoryService } from "@/services/category.service";

export default function ManageCategory() {
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");

    const fetchCategories = async () => {
        setIsLoading(true);
        const res = await categoryService.getAll();
        if (!res.error) {
            setCategories(res.data);
        } else {
            toast.error(res.error);
        }
        setIsLoading(false);
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        
        const res = await categoryService.delete(id);
        if (res.success) {
            toast.success(res.message);
            setCategories((prev) => prev.filter(c => c.id !== id));
        } else {
            toast.error(res.message);
        }
    };

    const handleUpdate = async (id: string) => {
        if (!editValue.trim()) return toast.error("Name is required");
        
        const res = await categoryService.update(id, { name: editValue });
        if (res.success) {
            toast.success(res.message);
            setCategories((prev) => 
                prev.map(c => c.id === id ? { ...c, name: editValue, slug: editValue.toLowerCase().replace(/\s+/g, '-') } : c)
            );
            setEditingId(null);
        } else {
            toast.error(res.message);
        }
    };

    const filteredCategories = useMemo(() => {
        return categories.filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [categories, searchTerm]);

    return (
        <div className="flex flex-col h-full bg-white font-sans">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
                <div className="flex items-center gap-2">
                    <div className="bg-zinc-900 p-1.5 rounded-sm">
                        <Layers size={18} className="text-white" />
                    </div>
                    <h1 className="text-lg font-semibold text-zinc-900">Manage Categories</h1>
                </div>
                <Button onClick={fetchCategories} variant="outline" className="h-9 px-4 text-xs font-bold gap-2 rounded-sm">
                    <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Refresh
                </Button>
            </div>

            <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/30">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                    <Input
                        placeholder="Search categories..."
                        className="pl-9 h-9 rounded-sm border-zinc-200 text-sm focus:ring-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <Table>
                    <TableHeader className="bg-zinc-50 sticky top-0 z-10">
                        <TableRow className="border-b border-zinc-200">
                            <TableHead className="w-[80px] text-[11px] font-bold uppercase text-zinc-500 text-center">SL</TableHead>
                            <TableHead className="text-[11px] font-bold uppercase text-zinc-500">Category Name</TableHead>
                            <TableHead className="text-[11px] font-bold uppercase text-zinc-500">Slug</TableHead>
                            <TableHead className="text-right text-[11px] font-bold uppercase text-zinc-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isLoading && filteredCategories.map((category, index) => (
                            <TableRow key={category.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 group transition-colors">
                                <TableCell className="text-xs font-bold text-zinc-400 text-center">
                                    {index + 1}
                                </TableCell>
                                <TableCell>
                                    {editingId === category.id ? (
                                        <Input 
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="h-8 text-sm rounded-sm border-zinc-300 focus:border-zinc-900 w-full max-w-[200px]"
                                            autoFocus
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Tags size={14} className="text-zinc-400" />
                                            <span className="text-sm font-semibold text-zinc-800">{category.name}</span>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <code className="text-[11px] bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600 font-medium">
                                        /{category.slug}
                                    </code>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        {editingId === category.id ? (
                                            <>
                                                <Button onClick={() => handleUpdate(category.id)} variant="ghost" className="h-8 w-8 p-0 text-green-600 hover:bg-green-50">
                                                    <Check size={16} />
                                                </Button>
                                                <Button onClick={() => setEditingId(null)} variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:bg-zinc-100">
                                                    <X size={16} />
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button onClick={() => { setEditingId(category.id); setEditValue(category.name); }} variant="ghost" className="h-8 w-8 p-0 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100">
                                                    <Edit2 size={14} />
                                                </Button>
                                                <Button onClick={() => handleDelete(category.id)} variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-red-600 hover:bg-red-50">
                                                    <Trash2 size={14} />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}