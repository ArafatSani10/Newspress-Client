"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    Trash2,
    Edit,
    Search,
    Plus,
    MoreHorizontal,
    ExternalLink,
    Newspaper
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsService, News } from "@/services/news.service";
import { toast } from "sonner";

export default function GetNews() {
    const [newsList, setNewsList] = useState<News[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchAllNews = async () => {
        setIsLoading(true);
        const { data, error } = await newsService.getAll();
        if (data) setNewsList(data);
        else toast.error(error || "Failed to load news");
        setIsLoading(false);
    };

    useEffect(() => { fetchAllNews(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const result = await newsService.delete(id);
        if (result.success) {
            toast.success("News removed");
            setNewsList((prev) => prev.filter((item) => item.id !== id));
        } else {
            toast.error(result.message);
        }
    };

    const filteredNews = newsList.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-white font-sans max-w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
                <div className="flex items-center gap-2">
                    <div className="bg-zinc-900 p-1.5 rounded-sm">
                        <Newspaper size={18} className="text-white" />
                    </div>
                    <h1 className="text-lg font-semibold text-zinc-900">Content Management</h1>
                </div>
                <Link href="/admin-createNews">
                    <Button className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-sm h-9 px-4 text-xs font-semibold gap-2">
                        <Plus size={16} /> Create News
                    </Button>
                </Link>
            </div>

            <div className="px-6 py-3 border-b border-zinc-100 bg-zinc-50/50">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                    <Input
                        placeholder="Search posts..."
                        className="pl-9 h-9 rounded-sm border-zinc-200 bg-white text-sm focus:ring-0 focus:border-zinc-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <Table className="border-collapse">
                    <TableHeader className="bg-zinc-50 sticky top-0 z-10">
                        <TableRow className="border-b border-zinc-200 hover:bg-transparent">
                            <TableHead className="h-10 text-sm font-semibold text-zinc-500 ">Title</TableHead>
                            <TableHead className="h-10 text-sm font-semibold text-zinc-500 ">Category</TableHead>
                            <TableHead className="h-10 text-sm font-semibold text-zinc-500 ">Analytics</TableHead>
                            <TableHead className="h-10 text-sm font-semibold text-zinc-500  text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 8 }).map((_, i) => (
                                <TableRow key={i} className="animate-pulse">
                                    <TableCell colSpan={5} className="py-4 border-b border-zinc-100">
                                        <div className="h-4 bg-zinc-100 rounded-sm w-full"></div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : filteredNews.length > 0 ? (
                            filteredNews.map((news) => (
                                <TableRow key={news.id} className="border-b border-zinc-100 hover:bg-zinc-50/50 group transition-none">
                                    <TableCell className="py-3">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-semibold text-zinc-800 leading-tight">
                                                {news.title}
                                            </span>
                                            <span className="text-[11px] text-zinc-400 font-medium">
                                               CreatedAt: {new Date(news.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-zinc-100 text-zinc-600 text-[10px] font-semibold border border-zinc-200">
                                            {news.category?.name || "NONE"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-[11px] font-semibold text-zinc-500">
                                            {news.viewCount.toLocaleString()} <span className="text-[9px] font-medium text-zinc-400">VIEWS</span>
                                        </div>
                                    </TableCell>
                                    
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-sm hover:bg-zinc-200">
                                                    <MoreHorizontal size={14} className="text-zinc-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-sm border-zinc-200 min-w-[140px] shadow-md">
                                                <DropdownMenuItem className="text-xs font-semibold py-2 cursor-pointer gap-2">
                                                    <Link href={`/news/${news.slug}`} className="flex items-center w-full gap-2">
                                                        <ExternalLink size={14} /> View Post
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-xs font-semibold py-2 cursor-pointer gap-2 text-blue-600">
                                                    <Link href={`/admin/news/edit/${news.id}`} className="flex items-center w-full gap-2">
                                                        <Edit size={14} /> Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-xs font-semibold py-2 cursor-pointer gap-2 text-red-600"
                                                    onClick={() => handleDelete(news.id)}
                                                >
                                                    <Trash2 size={14} /> Remove
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-20 text-xs font-semibold text-zinc-400">
                                    NO RECORDS FOUND
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}