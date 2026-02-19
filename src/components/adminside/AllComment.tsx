"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { 
    MessageSquare, Search, Trash2, RefreshCw, 
    Calendar, ArrowUpDown, User, Newspaper, FilterX, ExternalLink 
} from "lucide-react";
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { commentService, Comment } from "@/services/comment.service";

export default function AllComment() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");

    const fetchComments = async () => {
        setIsLoading(true);
        const res = await commentService.getAll();
        if (res.success) {
            setComments(res.data);
        } else {
            toast.error(res.error || "Failed to load comments");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const res = await commentService.delete(id);
        if (res.success) {
            toast.success(res.message);
            setComments((prev) => prev.filter(c => c.id !== id));
        } else {
            toast.error(res.message);
        }
    };

    const clearFilters = () => {
        setSearchTerm("");
        setFilterDate("");
        setSortOrder("desc");
    };

    const filteredAndSortedComments = useMemo(() => {
        let filtered = comments.filter((comment) => {
            const content = comment.text?.toLowerCase() || "";
            const postTitle = comment.post?.title?.toLowerCase() || comment.news?.title?.toLowerCase() || "";
            const userName = comment.user?.name?.toLowerCase() || "";
            const search = searchTerm.toLowerCase();

            const matchesSearch = content.includes(search) || postTitle.includes(search) || userName.includes(search);
            const matchesDate = filterDate ? new Date(comment.createdAt).toISOString().split('T')[0] === filterDate : true;

            return matchesSearch && matchesDate;
        });

        return filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        });
    }, [comments, searchTerm, filterDate, sortOrder]);

    return (
        <div className="flex flex-col h-full bg-white font-sans">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-6 border-b border-zinc-100 gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-zinc-900 p-2 rounded-sm shadow-sm">
                        <MessageSquare size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Comment Management</h1>
                        <p className="text-xs text-zinc-500 font-medium">Monitor and manage all user discussions</p>
                    </div>
                </div>
                <Button onClick={fetchComments} variant="outline" className="h-10 px-4 text-xs font-bold gap-2 rounded-sm border-zinc-200">
                    <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Sync Data
                </Button>
            </div>

            <div className="px-6 py-4 border-b border-zinc-50 bg-zinc-50/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-center gap-3">
                    <div className="relative flex-1 lg:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
                        <Input
                            placeholder="Search comments, users or news..."
                            className="pl-9 h-10 rounded-sm border-zinc-200 text-sm focus:ring-1 focus:ring-zinc-900"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Input 
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="h-10 w-full lg:w-48 rounded-sm border-zinc-200 text-sm"
                    />
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger className="h-10 w-full lg:w-44 rounded-sm border-zinc-200 text-sm font-semibold">
                            <div className="flex items-center gap-2">
                                <ArrowUpDown size={14} className="text-zinc-500" />
                                <SelectValue placeholder="Sort" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="desc">Newest First</SelectItem>
                            <SelectItem value="asc">Oldest First</SelectItem>
                        </SelectContent>
                    </Select>
                    {(searchTerm || filterDate) && (
                        <Button variant="ghost" onClick={clearFilters} className="h-10 px-3 text-red-500 hover:bg-red-50 rounded-sm gap-2 text-xs font-bold uppercase">
                            <FilterX size={16} /> Reset
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <Table>
                    <TableHeader className="bg-zinc-50/80 backdrop-blur-sm sticky top-0 z-10">
                        <TableRow className="border-b border-zinc-200">
                            <TableHead className="w-[200px] text-[11px] font-bold uppercase text-zinc-500">Author</TableHead>
                            <TableHead className="text-[11px] font-bold uppercase text-zinc-500">Comment</TableHead>
                            <TableHead className="w-[250px] text-[11px] font-bold uppercase text-zinc-500">Source News</TableHead>
                            <TableHead className="w-[150px] text-[11px] font-bold uppercase text-zinc-500">Date</TableHead>
                            <TableHead className="w-[80px] text-right text-[11px] font-bold uppercase text-zinc-500 px-6">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <TableRow key={i} className="animate-pulse">
                                    <TableCell><div className="h-8 bg-zinc-100 rounded w-full"></div></TableCell>
                                    <TableCell><div className="h-8 bg-zinc-100 rounded w-full"></div></TableCell>
                                    <TableCell><div className="h-8 bg-zinc-100 rounded w-full"></div></TableCell>
                                    <TableCell><div className="h-8 bg-zinc-100 rounded w-full"></div></TableCell>
                                    <TableCell><div className="h-8 bg-zinc-100 rounded w-full"></div></TableCell>
                                </TableRow>
                            ))
                        ) : filteredAndSortedComments.map((comment) => {
                            const postData = comment.post || comment.news;
                            return (
                                <TableRow key={comment.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200 overflow-hidden">
                                                {comment.user?.image ? <img src={comment.user.image} className="h-full w-full object-cover" /> : <User size={14} className="text-zinc-400" />}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-zinc-900 truncate max-w-[120px]">{comment.user?.name || "Guest"}</span>
                                                <span className="text-[10px] text-zinc-400 font-bold uppercase">{comment.user?.role}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-zinc-600 font-medium line-clamp-2 italic">"{comment.text}"</p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Newspaper size={14} className="text-zinc-300 shrink-0" />
                                            {postData?.slug || postData?.title ? (
                                                <Link 
                                                    href={`/news/${postData.slug || '#'}`} 
                                                    target="_blank"
                                                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 group/link"
                                                >
                                                    <span className="line-clamp-1">{postData.title || "View News"}</span>
                                                    <ExternalLink size={10} className="opacity-0 group-hover/link:opacity-100" />
                                                </Link>
                                            ) : (
                                                <span className="text-xs font-bold text-red-400">Post Unavailable</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs font-bold text-zinc-500">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right px-6">
                                        <Button onClick={() => handleDelete(comment.id)} variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all">
                                            <Trash2 size={16} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}