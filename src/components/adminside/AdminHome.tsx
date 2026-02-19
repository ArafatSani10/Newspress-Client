"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Users, MessageSquare, Zap, Clock, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    AreaChart, Area, CartesianGrid
} from "recharts";
import { statsService } from "@/services/stats.service";

const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AdminHome() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            const result = await statsService.getSummary();
            if (result.success && result.data) {
                setStats(result.data);
            }
            setIsLoading(false);
        };
        fetchStats();
    }, []);

    const chartData = allMonths.map(m => {
        const found = stats?.monthlyNews?.find((item: any) => item.month === m);
        return { month: m, total: found ? found.total : 0 };
    });

    if (isLoading) return <AdminSkeleton />;

    return (
        <div className="space-y-8  bg-zinc-50/50 min-h-screen max-w-full">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total News" value={stats?.totalNews} icon={Newspaper} color="text-blue-600" bg="bg-blue-50" />
                <StatCard title="Total Users" value={stats?.totalUsers} icon={Users} color="text-indigo-600" bg="bg-indigo-50" />
                <StatCard title="Total Comments" value={stats?.totalComments} icon={MessageSquare} color="text-fuchsia-600" bg="bg-fuchsia-50" />
                <StatCard title="Categories" value={stats?.totalCategories} icon={Zap} color="text-orange-600" bg="bg-orange-50" />
            </div>

            <div className="grid gap-6 lg:grid-cols-1">
                <Card className="lg:col-span-4 border-none shadow-sm rounded-sm bg-white overflow-hidden">
                    <CardHeader><CardTitle className="text-sm font-bold text-zinc-500">Yearly News Analytics</CardTitle></CardHeader>
                    <CardContent className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#71717a' }} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#71717a' }} />
                                <Tooltip contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                
            </div>

            <Card className="border-none shadow-sm rounded-sm bg-white overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-50 pb-4">
                    <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                    <Link href="/admin/comments" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">View All Activity</Link>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2  divide-y divide-zinc-50">
                        {stats?.recentComments?.map((comment: any) => (
                            <div key={comment.id} className="group flex items-start gap-4 p-6 hover:bg-zinc-50 transition-all">
                                <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-500 shrink-0 border border-zinc-200">
                                    {comment.user?.name ? comment.user.name[0].toUpperCase() : 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-sm font-bold text-zinc-900">{comment.user?.name}</h4>
                                        <div className="flex items-center gap-1.5 text-zinc-400">
                                            <Clock size={12} />
                                            <span className="text-[11px]">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-zinc-600 mb-3 italic">"{comment.text}"</p>

                                    <Link
                                        href={`/news/${comment.post?.slug}`}
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-sm bg-zinc-100 group-hover:bg-white border border-transparent group-hover:border-zinc-200 transition-all w-fit"
                                    >
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase">On Post:</span>
                                        <span className="text-[11px] font-bold text-red-600 truncate max-w-[200px] md:max-w-md">
                                            {comment.post?.title}
                                        </span>
                                        <ChevronRight size={14} className="text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
    return (
        <Card className="border-none shadow-sm rounded-sm bg-white overflow-hidden">
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-bold uppercase text-zinc-400 mb-1">{title}</p>
                    <h3 className="text-3xl font-black text-zinc-900">{value ?? 0}</h3>
                </div>
                <div className={`p-4 rounded-sm ${bg} ${color}`}>
                    <Icon size={24} strokeWidth={2.5} />
                </div>
            </CardContent>
        </Card>
    );
}

function AdminSkeleton() {
    return (
        <div className="p-8 space-y-8 max-w-full">
            <div className="grid grid-cols-4 gap-6"><Skeleton className="h-32 rounded-sm" /><Skeleton className="h-32 rounded-sm" /><Skeleton className="h-32 rounded-sm" /><Skeleton className="h-32 rounded-sm" /></div>
            <div className="grid grid-cols-7 gap-6"><Skeleton className="col-span-4 h-[350px] rounded-sm" /><Skeleton className="col-span-3 h-[350px] rounded-sm" /></div>
            <Skeleton className="h-64 rounded-sm" />
        </div>
    );
}