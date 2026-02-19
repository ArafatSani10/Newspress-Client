"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { newsService, News } from "@/services/news.service";
import Link from "next/link";
import Image from "next/image";
import { 
    PlayCircle, 
    Search, 
    Calendar, 
    ArrowUpDown, 
    ChevronDown,
    FilterX
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function CategoryPage() {
    const params = useParams();
    const [allNews, setAllNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    const [searchTitle, setSearchTitle] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");

    useEffect(() => {
        setMounted(true);
        const fetchNews = async () => {
            try {
                const res = await newsService.getAll();
                if (!res.error) setAllNews(res.data);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    const filteredAndSortedNews = useMemo(() => {
        const slug = params.slug as string;
        
        let filtered = allNews.filter((news) => news.category?.slug === slug);

        if (searchTitle) {
            filtered = filtered.filter((news) =>
                news.title.toLowerCase().includes(searchTitle.toLowerCase())
            );
        }

        if (searchDate) {
            filtered = filtered.filter((news) => {
                const newsDate = new Date(news.createdAt).toISOString().split('T')[0];
                return newsDate === searchDate;
            });
        }

        return filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        });
    }, [allNews, params.slug, searchTitle, searchDate, sortOrder]);

    const categoryName = allNews.find(n => n.category?.slug === params.slug)?.category?.name || (params.slug as string).replace(/-/g, ' ');

    const clearFilters = () => {
        setSearchTitle("");
        setSearchDate("");
        setSortOrder("desc");
    };

    const getYouTubeThumbnail = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) 
            ? `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg` 
            : null;
    };

    const CategorySkeleton = () => (
        <div className="container mx-auto px-4 py-8 animate-pulse">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div className="h-10 w-48 bg-zinc-200 rounded-sm"></div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="h-10 w-full md:w-64 bg-zinc-100 rounded-sm"></div>
                    <div className="h-10 w-32 bg-zinc-100 rounded-sm"></div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-4">
                        <div className="aspect-video bg-zinc-100 rounded-sm"></div>
                        <div className="h-6 bg-zinc-100 rounded w-3/4"></div>
                        <div className="h-4 bg-zinc-50 rounded w-full"></div>
                    </div>
                ))}
            </div>
        </div>
    );

    if (!mounted || loading) return <CategorySkeleton />;

    return (
        <div className="container mx-auto px-4 py-8 font-sans bg-white">
            <div className="flex flex-col border-b border-zinc-100 pb-8 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-zinc-900 capitalize tracking-tight">
                            {categoryName}
                        </h1>
                        <p className="text-zinc-500 mt-2 text-sm font-medium">
                            Displaying {filteredAndSortedNews.length} articles
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
                            <Input 
                                placeholder="Search by title..."
                                value={searchTitle}
                                onChange={(e) => setSearchTitle(e.target.value)}
                                className="pl-9 h-10 rounded-sm border-zinc-200 focus:border-zinc-400 focus:ring-0 text-sm"
                            />
                        </div>

                        <div className="relative flex-1 lg:w-48">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={15} />
                            <Input 
                                type="date"
                                value={searchDate}
                                onChange={(e) => setSearchDate(e.target.value)}
                                className="pl-9 h-10 rounded-sm border-zinc-200 focus:border-zinc-400 focus:ring-0 text-sm appearance-none"
                            />
                        </div>

                        <Select value={sortOrder} onValueChange={setSortOrder}>
                            <SelectTrigger className="h-10 w-full lg:w-40 rounded-sm border-zinc-200 text-sm font-semibold">
                                <div className="flex items-center gap-2">
                                    <ArrowUpDown size={14} />
                                    <SelectValue placeholder="Sort Order" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="rounded-sm border-zinc-200">
                                <SelectItem value="desc" className="text-xs font-semibold">Newest First</SelectItem>
                                <SelectItem value="asc" className="text-xs font-semibold">Oldest First</SelectItem>
                            </SelectContent>
                        </Select>

                        {(searchTitle || searchDate) && (
                            <Button 
                                variant="ghost" 
                                onClick={clearFilters}
                                className="h-10 px-3 text-zinc-500 hover:text-red-600 rounded-sm gap-2"
                            >
                                <FilterX size={16} />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {filteredAndSortedNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {filteredAndSortedNews.map((news) => {
                        const ytThumb = news.videoUrl ? getYouTubeThumbnail(news.videoUrl) : null;
                        const displayImage = news.featuredImage || ytThumb;

                        return (
                            <Link href={`/news/${news.slug}`} key={news.id} className="group block">
                                <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-zinc-50 mb-4 border border-zinc-100">
                                    {displayImage ? (
                                        <>
                                            <Image 
                                                src={displayImage} 
                                                alt="" 
                                                fill 
                                                className="object-cover transition-transform duration-500 group-hover:scale-105" 
                                            />
                                            {news.videoUrl && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/10 group-hover:bg-zinc-900/30 transition-colors">
                                                    <PlayCircle className="text-white w-12 h-12 drop-shadow-2xl opacity-90" />
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-300 text-[10px] font-bold uppercase tracking-widest">
                                            No Media
                                        </div>
                                    )}
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center text-[11px] font-bold uppercase tracking-wider text-zinc-400 gap-2">
                                        <span className="text-zinc-900">{news.category?.name}</span>
                                        <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                                        <span>{new Date(news.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    
                                    <h2 className="text-[20px] font-bold leading-[1.3] text-zinc-900 group-hover:text-zinc-600 transition-colors line-clamp-2">
                                        {news.title}
                                    </h2>
                                    
                                    <p className="text-zinc-500 text-[14px] line-clamp-2 leading-relaxed font-medium">
                                        {news.summary || news.content?.replace(/<[^>]*>/g, '').substring(0, 110)}...
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="py-32 flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-sm bg-zinc-50/50">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                        <Search size={32} className="text-zinc-200" />
                    </div>
                    <p className="text-zinc-500 font-semibold text-lg">No matching articles found</p>
                    <p className="text-zinc-400 text-sm mt-1">Try adjusting your filters or search terms</p>
                    <Button 
                        variant="link" 
                        onClick={clearFilters}
                        className="mt-4 text-zinc-900 font-bold hover:no-underline"
                    >
                        Clear all filters
                    </Button>
                </div>
            )}
        </div>
    );
}