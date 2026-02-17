"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Users, MessageSquare, Zap } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid
} from "recharts";

const newsData = [
    { month: "Jan", total: 40 },
    { month: "Feb", total: 30 },
    { month: "Mar", total: 60 },
    { month: "Apr", total: 45 },
    { month: "May", total: 90 },
    { month: "Jun", total: 75 },
];

const engagementData = [
    { name: "News A", views: 400, comments: 240 },
    { name: "News B", views: 300, comments: 139 },
    { name: "News C", views: 200, comments: 980 },
    { name: "News D", views: 278, comments: 390 },
    { name: "News E", views: 189, comments: 480 },
];

export default function AdminHome() {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Total News", value: "1,284", icon: Newspaper, color: "text-blue-600", bg: "bg-blue-50" },
                    { title: "All Users", value: "8,432", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { title: "All Comments", value: "45.2k", icon: MessageSquare, color: "text-fuchsia-600", bg: "bg-fuchsia-50" },
                    { title: "Active Now", value: "573", icon: Zap, color: "text-orange-600", bg: "bg-orange-50" },
                ].map((item, i) => (
                    <Card key={i} className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.03)] rounded-xl overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-zinc-500">{item.title}</p>
                                    <h3 className="text-2xl font-bold mt-1 text-zinc-900">{item.value}</h3>
                                </div>
                                <div className={`p-3 rounded-lg ${item.bg}`}>
                                    <item.icon className={`size-5 ${item.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.03)] rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-bold text-zinc-800">News Published</CardTitle>
                            <p className="text-xs text-zinc-400 mt-0.5">Monthly creation analytics</p>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[320px] px-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={newsData}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorTotal)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.03)] rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-base font-bold text-zinc-800">Engagement Overview</CardTitle>
                        <p className="text-xs text-zinc-400 mt-0.5">Comparison between views and comments</p>
                    </CardHeader>
                    <CardContent className="h-[320px] px-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={engagementData} barGap={8}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: '#f9fafb' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="views" fill="#18181b" radius={[6, 6, 0, 0]} barSize={12} />
                                <Bar dataKey="comments" fill="#e4e4e7" radius={[6, 6, 0, 0]} barSize={12} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}